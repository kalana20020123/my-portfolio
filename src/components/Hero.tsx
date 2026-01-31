"use client";

import React, { Suspense, useState, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment, useAnimations } from "@react-three/drei";
import * as THREE from "three";

function BoyModel({ 
  mousePosition, 
  scrollProgress 
}: { 
  mousePosition: { x: number; y: number };
  scrollProgress: number;
}) {
  const gltf = useGLTF("/models/stylized+boy+3d+model.glb");
  const { animations } = gltf;
  const modelRef = useRef<THREE.Group>(null);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const eyeRefs = useRef<THREE.Mesh[]>([]);
  const blinkTimerRef = useRef<number>(0);
  const isBlinkingRef = useRef(false);
  const nextBlinkIntervalRef = useRef<number>(2 + Math.random() * 3);
  const morphTargetInfluencesRef = useRef<{ mesh: THREE.Mesh; index: number }[]>([]);
  
  // Smooth rotation targets
  const targetRotationY = useRef(0);
  const targetRotationX = useRef(0);
  const currentRotationY = useRef(0);
  const currentRotationX = useRef(0);
  
  // Idle animation state
  const idleTimeRef = useRef(0);
  const basePositionRef = useRef(new THREE.Vector3(0, 0, 0));

  // Setup animation mixer if model has animations
  useEffect(() => {
    if (modelRef.current && animations && animations.length > 0) {
      mixerRef.current = new THREE.AnimationMixer(modelRef.current);
      
      // Play all available animations
      animations.forEach((clip) => {
        const action = mixerRef.current!.clipAction(clip);
        action.play();
        // Make animations loop smoothly (setLoop takes mode and repetitions)
        action.setLoop(THREE.LoopRepeat, Infinity);
      });
      
      console.log(`Playing ${animations.length} animation(s) from model`);
    }
  }, [animations]);

  // Find eye meshes in the model
  useEffect(() => {
    if (modelRef.current) {
      const eyes: THREE.Mesh[] = [];
      const morphTargets: { mesh: THREE.Mesh; index: number }[] = [];
      
      modelRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          const name = child.name.toLowerCase();
          
          // Look for common eye naming patterns
          if (
            name.includes("eye") ||
            name.includes("eyeball") ||
            name.includes("pupil") ||
            name.includes("iris") ||
            name.includes("eyelid")
          ) {
            eyes.push(child);
          }

          // Check for morph targets (blend shapes) for blinking
          if (child.morphTargetInfluences && child.morphTargetInfluences.length > 0) {
            const morphTargetNames = child.morphTargetDictionary || {};
            for (const [key, index] of Object.entries(morphTargetNames)) {
              const keyLower = key.toLowerCase();
              if (
                keyLower.includes("blink") ||
                keyLower.includes("eye") ||
                keyLower.includes("close")
              ) {
                morphTargets.push({ mesh: child, index: index as number });
              }
            }
          }
        }
      });

      // If no eyes found by name, try to find by position and size
      if (eyes.length === 0) {
        const candidates: { mesh: THREE.Mesh; y: number; size: number }[] = [];
        
        modelRef.current.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            const size = new THREE.Box3().setFromObject(child);
            const dimensions = size.getSize(new THREE.Vector3());
            const center = size.getCenter(new THREE.Vector3());
            const maxDimension = Math.max(dimensions.x, dimensions.y, dimensions.z);
            
            // Eyes are typically small meshes positioned in the upper part of the head
            if (maxDimension < 0.4 && center.y > 0 && child.material) {
              candidates.push({ 
                mesh: child, 
                y: center.y, 
                size: maxDimension 
              });
            }
          }
        });

        // Sort by Y position (higher = more likely to be eyes) and take top 2
        candidates.sort((a, b) => b.y - a.y);
        eyes.push(...candidates.slice(0, 2).map(c => c.mesh));
      }

      eyeRefs.current = eyes.slice(0, 2);
      morphTargetInfluencesRef.current = morphTargets;
      
      // Debug: log found eyes (can be removed in production)
      if (eyes.length > 0) {
        console.log(`Found ${eyes.length} eye(s) for blinking animation`);
      }
      if (morphTargets.length > 0) {
        console.log(`Found ${morphTargets.length} morph target(s) for blinking`);
      }
    }
  }, [gltf]);

  useFrame((state, delta) => {
    // Update animation mixer if it exists
    if (mixerRef.current) {
      mixerRef.current.update(delta);
    }
    
    if (modelRef.current) {
      // Smooth interpolation factor (higher = faster, lower = smoother)
      const lerpFactor = 0.15;
      
      // Calculate target rotation based on mouse position and scroll
      // Combine mouse movement with scroll-based rotation for dynamic effect
      const scrollRotation = scrollProgress * Math.PI * 0.5; // Scroll adds rotation
      targetRotationY.current = mousePosition.x * Math.PI * 0.6 + scrollRotation; // Face follows mouse direction
      targetRotationX.current = mousePosition.y * Math.PI * 0.25; // Face follows mouse direction
      
      // Add idle rotation animation when no interaction - more visible
      idleTimeRef.current += delta;
      const idleRotationY = Math.sin(idleTimeRef.current * 0.4) * 0.15; // More pronounced sway
      const idleRotationX = Math.cos(idleTimeRef.current * 0.25) * 0.08; // More visible nod
      const idleRotationZ = Math.sin(idleTimeRef.current * 0.35) * 0.05; // Subtle tilt
      
      // Combine interaction and idle animations
      const finalTargetY = targetRotationY.current + idleRotationY;
      const finalTargetX = targetRotationX.current + idleRotationX;
      
      // Smooth interpolation (lerp) for natural movement
      currentRotationY.current += (finalTargetY - currentRotationY.current) * lerpFactor;
      currentRotationX.current += (finalTargetX - currentRotationX.current) * lerpFactor;
      
      // Apply smooth rotation with idle Z rotation
      // Add initial rotation offset to face the camera (180 degrees = Math.PI)
      modelRef.current.rotation.y = currentRotationY.current + Math.PI;
      modelRef.current.rotation.x = currentRotationX.current;
      modelRef.current.rotation.z = idleRotationZ;
      
      // Add breathing/floating animation - more pronounced and visible
      const breathing = Math.sin(state.clock.elapsedTime * 1.8) * 0.2; // More breathing movement
      const floatOffset = Math.sin(state.clock.elapsedTime * 0.6 + scrollProgress * 2) * 0.15; // More float
      const sideSway = Math.cos(state.clock.elapsedTime * 0.5) * 0.08; // Side to side movement
      modelRef.current.position.y = basePositionRef.current.y + breathing + floatOffset;
      modelRef.current.position.x = basePositionRef.current.x + sideSway;
      
      // More visible scale animation for breathing effect
      const scaleBreathing = 1 + Math.sin(state.clock.elapsedTime * 1.5) * 0.03;
      modelRef.current.scale.setScalar(3.5 * scaleBreathing);
    }

    // Blinking animation
    blinkTimerRef.current += delta;
    
    if (blinkTimerRef.current >= nextBlinkIntervalRef.current && !isBlinkingRef.current) {
      isBlinkingRef.current = true;
      blinkTimerRef.current = 0;
      // Set next random blink interval
      nextBlinkIntervalRef.current = 2 + Math.random() * 3;
    }

    // Animate the blink
    if (isBlinkingRef.current) {
      const blinkDuration = 0.15; // Blink duration in seconds
      const progress = blinkTimerRef.current / blinkDuration;
      
      if (progress < 1) {
        // Create a smooth blink animation
        const blinkValue = Math.sin(progress * Math.PI);
        
        // Try morph targets first (most natural)
        if (morphTargetInfluencesRef.current.length > 0) {
          morphTargetInfluencesRef.current.forEach(({ mesh, index }) => {
            if (mesh.morphTargetInfluences) {
              mesh.morphTargetInfluences[index] = Math.abs(blinkValue);
            }
          });
        }
        
        // Fallback to scale animation if no morph targets
        if (morphTargetInfluencesRef.current.length === 0 && eyeRefs.current.length > 0) {
          const scale = Math.abs(blinkValue);
          eyeRefs.current.forEach((eye) => {
            if (eye) {
              eye.scale.y = scale;
            }
          });
        }
      } else {
        // Reset after blink
        if (morphTargetInfluencesRef.current.length > 0) {
          morphTargetInfluencesRef.current.forEach(({ mesh, index }) => {
            if (mesh.morphTargetInfluences) {
              mesh.morphTargetInfluences[index] = 0;
            }
          });
        }
        
        if (eyeRefs.current.length > 0) {
          eyeRefs.current.forEach((eye) => {
            if (eye) {
              eye.scale.y = 1;
            }
          });
        }
        
        isBlinkingRef.current = false;
        blinkTimerRef.current = 0;
      }
    }
  });

  return (
    <primitive
      ref={modelRef}
      object={gltf.scene}
      scale={3.5}
      position={basePositionRef.current}
    />
  );
}

function PlaceholderModel({ 
  mousePosition, 
  scrollProgress 
}: { 
  mousePosition: { x: number; y: number };
  scrollProgress: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const targetRotationY = useRef(0);
  const targetRotationX = useRef(0);
  const currentRotationY = useRef(0);
  const currentRotationX = useRef(0);

  useFrame((state) => {
    if (meshRef.current) {
      const lerpFactor = 0.1;
      const scrollRotation = scrollProgress * Math.PI * 0.5;
      targetRotationY.current = mousePosition.x * Math.PI * 0.5 + scrollRotation; // Face follows mouse direction
      targetRotationX.current = mousePosition.y * Math.PI * 0.2; // Face follows mouse direction
      
      currentRotationY.current += (targetRotationY.current - currentRotationY.current) * lerpFactor;
      currentRotationX.current += (targetRotationX.current - currentRotationX.current) * lerpFactor;
      
      meshRef.current.rotation.y = currentRotationY.current + Math.PI; // Face the camera
      meshRef.current.rotation.x = currentRotationX.current;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="#3b82f6" />
    </mesh>
  );
}

function ModelWrapper({ 
  mousePosition, 
  scrollProgress 
}: { 
  mousePosition: { x: number; y: number };
  scrollProgress: number;
}) {
  const [modelExists, setModelExists] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/models/stylized+boy+3d+model.glb", { method: "HEAD" })
      .then((res) => {
        setModelExists(res.ok);
      })
      .catch(() => {
        setModelExists(false);
      });
  }, []);

  if (modelExists === null) {
    return null;
  }

  if (!modelExists) {
    return <PlaceholderModel mousePosition={mousePosition} scrollProgress={scrollProgress} />;
  }

  return (
    <Suspense fallback={null}>
      <BoyModel mousePosition={mousePosition} scrollProgress={scrollProgress} />
    </Suspense>
  );
}

// Modern Minimal Tech Background Component
function FuturisticBackground({ 
  mousePosition 
}: { 
  mousePosition: { x: number; y: number };
}) {
  const gridWaveRef = useRef<THREE.Mesh>(null);
  const backgroundRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const originalParticlePositions = useRef<Float32Array | null>(null);
  
  // Create light particles
  useEffect(() => {
    if (particlesRef.current && !particlesRef.current.geometry.attributes.position) {
      const count = 80; // Reduced for minimalism
      const positions = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);
      
      // Subtle blue and purple palette
      const colorPalette = [
        [0.15, 0.35, 0.55], // Deep blue
        [0.20, 0.25, 0.50], // Purple-blue
        [0.10, 0.40, 0.50], // Cyan-blue
      ];
      
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        // Distribute in outer regions, avoiding center
        const angle = Math.random() * Math.PI * 2;
        const radius = 5 + Math.random() * 6;
        const x = Math.cos(angle) * radius;
        const y = (Math.random() - 0.5) * 5;
        const z = -4 - Math.random() * 3;
        
        positions[i3] = x;
        positions[i3 + 1] = y;
        positions[i3 + 2] = z;
        
        const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
        colors[i3] = color[0];
        colors[i3 + 1] = color[1];
        colors[i3 + 2] = color[2];
      }
      
      particlesRef.current.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      particlesRef.current.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      originalParticlePositions.current = new Float32Array(positions);
    }
  }, []);

  // Create soft glowing lines (code-inspired patterns)
  useEffect(() => {
    if (linesRef.current && !linesRef.current.geometry.attributes.position) {
      const lineCount = 12;
      const positions = new Float32Array(lineCount * 6); // 2 points per line * 3 coords
      const colors = new Float32Array(lineCount * 6);
      
      for (let i = 0; i < lineCount; i++) {
        const i6 = i * 6;
        // Create horizontal and vertical lines in outer regions
        const isHorizontal = i % 2 === 0;
        const offset = (i - lineCount / 2) * 1.5;
        
        if (isHorizontal) {
          // Horizontal lines
          positions[i6] = -8;
          positions[i6 + 1] = offset;
          positions[i6 + 2] = -5 - Math.random() * 2;
          positions[i6 + 3] = 8;
          positions[i6 + 4] = offset;
          positions[i6 + 5] = -5 - Math.random() * 2;
        } else {
          // Vertical lines
          positions[i6] = offset;
          positions[i6 + 1] = -6;
          positions[i6 + 2] = -5 - Math.random() * 2;
          positions[i6 + 3] = offset;
          positions[i6 + 4] = 6;
          positions[i6 + 5] = -5 - Math.random() * 2;
        }
        
        // Subtle blue/purple glow
        const colorIntensity = 0.15 + Math.random() * 0.1;
        const colorChoice = Math.random() > 0.5 ? [0.2, 0.4, 0.6] : [0.3, 0.25, 0.5];
        for (let j = 0; j < 6; j += 3) {
          colors[i6 + j] = colorChoice[0] * colorIntensity;
          colors[i6 + j + 1] = colorChoice[1] * colorIntensity;
          colors[i6 + j + 2] = colorChoice[2] * colorIntensity;
        }
      }
      
      linesRef.current.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      linesRef.current.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    }
  }, []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    // Animate background shader
    if (backgroundRef.current && backgroundRef.current.material) {
      const material = backgroundRef.current.material as THREE.ShaderMaterial;
      if (material.uniforms && material.uniforms.time) {
        material.uniforms.time.value = time;
      }
    }
    
    // Animate grid waves
    if (gridWaveRef.current && gridWaveRef.current.material) {
      const material = gridWaveRef.current.material as THREE.ShaderMaterial;
      if (material.uniforms && material.uniforms.time) {
        material.uniforms.time.value = time;
      }
    }

    // Subtle particle animation
    if (particlesRef.current && particlesRef.current.geometry.attributes.position && originalParticlePositions.current) {
      const positions = particlesRef.current.geometry.attributes.position;
      const time = state.clock.elapsedTime;
      
      for (let i = 0; i < positions.count; i++) {
        const i3 = i * 3;
        const originalZ = originalParticlePositions.current[i3 + 2];
        // Subtle floating animation
        positions.array[i3 + 1] = originalParticlePositions.current[i3 + 1] + Math.sin(time * 0.3 + i * 0.1) * 0.2;
        positions.array[i3 + 2] = originalZ + Math.cos(time * 0.2 + i * 0.15) * 0.15;
      }
      positions.needsUpdate = true;
    }

    // Subtle line pulse
    if (linesRef.current) {
      const opacity = 0.15 + Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
      (linesRef.current.material as THREE.LineBasicMaterial).opacity = opacity;
    }
  });

  return (
    <>
      {/* Main Gradient Background with Tech Patterns */}
      <mesh ref={backgroundRef} position={[0, 0, -8]} scale={[20, 20, 1]}>
        <planeGeometry args={[1, 1]} />
        <shaderMaterial
          vertexShader={`
            varying vec2 vUv;
            void main() {
              vUv = uv;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={`
            varying vec2 vUv;
            uniform float time;
            
            void main() {
              vec2 uv = vUv;
              
              // Deep navy, charcoal, black gradient
              vec3 deepNavy = vec3(0.05, 0.08, 0.12);    // Deep navy
              vec3 charcoal = vec3(0.08, 0.08, 0.10);     // Charcoal
              vec3 black = vec3(0.02, 0.02, 0.03);        // Near black
              
              // Radial gradient from center
              float dist = length(uv - 0.5) * 2.0;
              vec3 baseColor = mix(black, deepNavy, dist * 0.6);
              baseColor = mix(baseColor, charcoal, uv.y * 0.4);
              
              // Subtle blue/purple highlights at edges
              float edgeGlow = smoothstep(0.6, 1.0, dist);
              vec3 blueHighlight = vec3(0.08, 0.20, 0.35) * edgeGlow * 0.25;
              vec3 purpleHighlight = vec3(0.15, 0.12, 0.25) * (1.0 - uv.y) * edgeGlow * 0.2;
              
              // Code-inspired grid pattern (subtle)
              float gridSize = 20.0;
              vec2 gridUV = fract(uv * gridSize);
              float gridLine = step(0.98, gridUV.x) + step(0.98, gridUV.y);
              vec3 gridColor = vec3(0.1, 0.15, 0.25) * gridLine * 0.15;
              
              // Subtle wave pattern
              float wave = sin(uv.x * 10.0 + time * 0.5) * 0.5 + 0.5;
              vec3 waveColor = vec3(0.05, 0.10, 0.20) * wave * 0.1;
              
              vec3 finalColor = baseColor + blueHighlight + purpleHighlight + gridColor + waveColor;
              
              // Keep center very clean and dark
              float centerMask = smoothstep(0.0, 0.5, dist);
              finalColor = mix(finalColor * 0.6, finalColor, centerMask);
              
              gl_FragColor = vec4(finalColor, 1.0);
            }
          `}
          uniforms={{
            time: { value: 0 } as THREE.IUniform
          }}
        />
      </mesh>

      {/* Animated Grid Waves */}
      <mesh ref={gridWaveRef} position={[0, 0, -6]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[18, 18, 40, 40]} />
        <shaderMaterial
          side={THREE.DoubleSide}
          transparent
          opacity={0.08}
          vertexShader={`
            varying vec3 vPosition;
            varying vec2 vUv;
            uniform float time;
            
            void main() {
              vUv = uv;
              vPosition = position;
              
              // Subtle wave animation
              vec3 pos = position;
              pos.z += sin(pos.x * 0.5 + time * 0.3) * 0.1;
              pos.z += cos(pos.y * 0.5 + time * 0.2) * 0.1;
              
              gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            }
          `}
          fragmentShader={`
            varying vec3 vPosition;
            varying vec2 vUv;
            uniform float time;
            
            void main() {
              // Grid pattern
              vec2 grid = abs(fract(vUv * 20.0 - 0.5) - 0.5) / fwidth(vUv * 20.0);
              float gridLine = min(grid.x, grid.y);
              float gridAlpha = 1.0 - min(gridLine, 1.0);
              
              // Subtle blue/purple tint
              vec3 color = mix(
                vec3(0.1, 0.2, 0.35),
                vec3(0.2, 0.15, 0.3),
                sin(time * 0.5) * 0.5 + 0.5
              );
              
              gl_FragColor = vec4(color, gridAlpha * 0.15);
            }
          `}
          uniforms={{
            time: { value: 0 } as THREE.IUniform
          }}
          wireframe={false}
        />
      </mesh>

      {/* Soft Glowing Lines (Code-inspired) */}
      <lineSegments ref={linesRef}>
        <bufferGeometry />
        <lineBasicMaterial
          vertexColors={true}
          transparent
          opacity={0.15}
          linewidth={1}
        />
      </lineSegments>

      {/* Light Particles */}
      <points ref={particlesRef}>
        <bufferGeometry />
        <pointsMaterial
          size={0.12}
          vertexColors={true}
          transparent
          opacity={0.4}
          sizeAttenuation={true}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Subtle Ambient Lighting */}
      <pointLight position={[-7, 4, -4]} intensity={0.15} color={0x3b82f6} distance={12} decay={2} />
      <pointLight position={[7, -4, -4]} intensity={0.12} color={0x8b5cf6} distance={12} decay={2} />
    </>
  );
}

function Scene({ 
  mousePosition, 
  scrollProgress 
}: { 
  mousePosition: { x: number; y: number };
  scrollProgress: number;
}) {
  return (
    <>
      {/* Futuristic Background */}
      <FuturisticBackground mousePosition={mousePosition} />
      
      {/* Enhanced Lighting for Model */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} color={0xffffff} />
      <directionalLight position={[-5, 3, 5]} intensity={0.4} color={0x6b9fff} />
      <pointLight position={[0, 2, 3]} intensity={0.5} color={0xa5b4fc} distance={8} decay={2} />
      
      {/* 3D Model */}
      <ModelWrapper mousePosition={mousePosition} scrollProgress={scrollProgress} />
      
      {/* Subtle Environment for model reflections */}
      <Environment preset="night" />
    </>
  );
}

export default function Hero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentTitleIndex, setCurrentTitleIndex] = useState(0);
  const canvasRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const lastTouchRef = useRef<{ x: number; y: number } | null>(null);
  const returnToCenterAnimationRef = useRef<number | null>(null);

  const titles = [
    "Software Engineer",
    "Full-Stack Developer",
    "Web & Mobile Application Developer"
  ];

  // Handle mouse movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        // Normalize mouse position to -0.5 to 0.5 range
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        setMousePosition({ x, y });
      }
    };

    const canvasElement = canvasRef.current;
    if (canvasElement) {
      canvasElement.addEventListener("mousemove", handleMouseMove);
      return () => {
        canvasElement.removeEventListener("mousemove", handleMouseMove);
      };
    }
  }, []);

  // Handle touch/swipe events for mobile
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (canvasRef.current && e.touches.length > 0) {
        const rect = canvasRef.current.getBoundingClientRect();
        const touch = e.touches[0];
        touchStartRef.current = {
          x: touch.clientX - rect.left,
          y: touch.clientY - rect.top
        };
        lastTouchRef.current = touchStartRef.current;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (canvasRef.current && e.touches.length > 0 && lastTouchRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        const touch = e.touches[0];
        const currentX = touch.clientX - rect.left;
        const currentY = touch.clientY - rect.top;
        
        // Calculate normalized position based on touch movement
        const x = (currentX / rect.width - 0.5) * 2; // Scale for more responsive touch
        const y = (currentY / rect.height - 0.5) * 2;
        
        setMousePosition({ x, y });
        lastTouchRef.current = { x: currentX, y: currentY };
      }
    };

    const handleTouchEnd = () => {
      touchStartRef.current = null;
      lastTouchRef.current = null;
      
      // Cancel any existing return-to-center animation
      if (returnToCenterAnimationRef.current !== null) {
        cancelAnimationFrame(returnToCenterAnimationRef.current);
      }
      
      // Gradually return to center
      const returnToCenter = () => {
        setMousePosition(prev => {
          const newX = prev.x * 0.92;
          const newY = prev.y * 0.92;
          if (Math.abs(newX) < 0.01 && Math.abs(newY) < 0.01) {
            returnToCenterAnimationRef.current = null;
            return { x: 0, y: 0 };
          }
          returnToCenterAnimationRef.current = requestAnimationFrame(returnToCenter);
          return { x: newX, y: newY };
        });
      };
      returnToCenterAnimationRef.current = requestAnimationFrame(returnToCenter);
    };

    const canvasElement = canvasRef.current;
    if (canvasElement) {
      canvasElement.addEventListener("touchstart", handleTouchStart, { passive: true });
      canvasElement.addEventListener("touchmove", handleTouchMove, { passive: true });
      canvasElement.addEventListener("touchend", handleTouchEnd, { passive: true });
      
      return () => {
        canvasElement.removeEventListener("touchstart", handleTouchStart);
        canvasElement.removeEventListener("touchmove", handleTouchMove);
        canvasElement.removeEventListener("touchend", handleTouchEnd);
        // Clean up animation on unmount
        if (returnToCenterAnimationRef.current !== null) {
          cancelAnimationFrame(returnToCenterAnimationRef.current);
        }
      };
    }
  }, []);

  // Handle scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const heroSection = canvasRef.current?.closest('section');
      if (heroSection) {
        const rect = heroSection.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        // Calculate scroll progress: 0 when section is fully visible, 1 when scrolled past
        const progress = Math.max(0, Math.min(1, (windowHeight - rect.top) / windowHeight));
        setScrollProgress(progress);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial calculation
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTitleIndex((prevIndex) => (prevIndex + 1) % titles.length);
    }, 2000); // Switch every 2 seconds

    return () => clearInterval(interval);
  }, [titles.length]);

  return (
    <section id="home" className="relative min-h-screen flex flex-col md:flex-row items-center justify-center px-4 py-20 overflow-hidden bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-[#0a0e1a] dark:via-[#0d0f14] dark:to-[#050608]">
      {/* CSS Background Gradient Overlay - Light mode: subtle, Dark mode: Deep Navy, Charcoal, Black */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/30 dark:from-[#0a0e1a] dark:via-[#0d0f14] dark:to-[#050608] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(59,130,246,0.1)_0%,_transparent_70%)] dark:bg-[radial-gradient(ellipse_at_center,_transparent_50%,_rgba(8,12,20,0.9)_100%)] pointer-events-none" />
      
      <div className="relative z-10 flex-1 max-w-2xl space-y-6 mb-12 md:mb-0 md:pr-8">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-4 drop-shadow-[0_2px_8px_rgba(0,0,0,0.1)] dark:drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
          Hi, I'm <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 dark:from-blue-400 dark:via-blue-500 dark:to-purple-500 bg-clip-text text-transparent">Kalana Sandeep</span>👋
        </h1>
        <p className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-6 min-h-[3rem] md:min-h-[4rem]">
          <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 dark:from-blue-400 dark:via-purple-400 dark:to-blue-500 bg-clip-text text-transparent drop-shadow-[0_2px_6px_rgba(59,130,246,0.2)] dark:drop-shadow-[0_2px_6px_rgba(59,130,246,0.15)]">
            {titles[currentTitleIndex]}
          </span>
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <a
            href="/CV.pdf"
            download="Kalana_Sandeep_CV.pdf"
            className="group relative inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 dark:from-blue-500 dark:via-blue-600 dark:to-purple-500 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:from-blue-500 hover:via-blue-600 hover:to-purple-500 dark:hover:from-blue-400 dark:hover:via-blue-500 dark:hover:to-purple-400"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Download CV
          </a>
        </div>
      </div>
      <div 
        ref={canvasRef}
        className="relative z-10 flex-1 w-full h-[400px] md:h-[600px] touch-none"
        style={{ touchAction: 'none' }}
      >
        <Canvas 
          camera={{ position: [0, 0, 5], fov: 50 }}
          gl={{ antialias: true, alpha: true }}
          dpr={[1, 2]} // Better performance on mobile
        >
          <Scene mousePosition={mousePosition} scrollProgress={scrollProgress} />
        </Canvas>
      </div>
    </section>
  );
}
