"use client";

import { Suspense, useState, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment } from "@react-three/drei";
import * as THREE from "three";

function DeskModel({ mousePosition, scrollProgress }: { mousePosition: { x: number; y: number }, scrollProgress: number }) {
  const gltf = useGLTF("/models/boy+at+desk+3d+model.glb");
  const modelRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (modelRef.current) {
      // Combine mouse position and scroll progress for rotation
      const mouseRotationY = mousePosition.x * Math.PI * 0.3;
      const mouseRotationX = mousePosition.y * Math.PI * 0.2;
      
      // Scroll-based rotation (rotates as you scroll)
      const scrollRotationY = scrollProgress * Math.PI * 2;
      const scrollRotationX = scrollProgress * Math.PI * 0.5;
      
      modelRef.current.rotation.y = mouseRotationY + scrollRotationY;
      modelRef.current.rotation.x = mouseRotationX + scrollRotationX;
      
      // Scale based on scroll (slight zoom effect)
      const scale = 3.5 + scrollProgress * 0.5;
      modelRef.current.scale.set(scale, scale, scale);
      
      // Vertical position based on scroll
      const yPosition = 0.5 + scrollProgress * 0.3;
      modelRef.current.position.y = yPosition;
    }
  });

  return (
    <primitive
      ref={modelRef}
      object={gltf.scene}
      scale={3.5}
      position={[0, 0.5, 0]}
    />
  );
}

function PlaceholderModel({ mousePosition, scrollProgress }: { mousePosition: { x: number; y: number }, scrollProgress: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      const mouseRotationY = mousePosition.x * Math.PI * 0.3;
      const mouseRotationX = mousePosition.y * Math.PI * 0.2;
      const scrollRotationY = scrollProgress * Math.PI * 2;
      const scrollRotationX = scrollProgress * Math.PI * 0.5;
      
      meshRef.current.rotation.y = mouseRotationY + scrollRotationY;
      meshRef.current.rotation.x = mouseRotationX + scrollRotationX;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="#3b82f6" />
    </mesh>
  );
}

function ModelWrapper({ mousePosition, scrollProgress }: { mousePosition: { x: number; y: number }, scrollProgress: number }) {
  const [modelExists, setModelExists] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/models/boy+at+desk+3d+model.glb", { method: "HEAD" })
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
      <DeskModel mousePosition={mousePosition} scrollProgress={scrollProgress} />
    </Suspense>
  );
}

function Scene({ mousePosition, scrollProgress }: { mousePosition: { x: number; y: number }, scrollProgress: number }) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 4, 5]} intensity={0.9} color={0xffffff} />
      <directionalLight position={[-3, 2, 3]} intensity={0.5} color={0xa5b4fc} />
      <pointLight position={[0, 3, 2]} intensity={0.4} color={0x6b9fff} distance={8} decay={2} />
      <ModelWrapper mousePosition={mousePosition} scrollProgress={scrollProgress} />
      <Environment preset="night" />
    </>
  );
}

export default function About() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);
  const canvasRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

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

    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // Calculate scroll progress: 0 when section is at top, 1 when at bottom
        // Normalize to 0-1 range based on section visibility
        const sectionTop = rect.top;
        const sectionHeight = rect.height;
        const viewportCenter = windowHeight / 2;
        
        // Progress from 0 to 1 as section scrolls through viewport
        let progress = 0;
        if (sectionTop < viewportCenter && sectionTop + sectionHeight > viewportCenter) {
          // Section is in viewport
          progress = Math.max(0, Math.min(1, (viewportCenter - sectionTop) / (sectionHeight + windowHeight)));
        } else if (sectionTop + sectionHeight < viewportCenter) {
          // Section has passed
          progress = 1;
        }
        
        setScrollProgress(progress);
      }
    };

    const canvasElement = canvasRef.current;
    if (canvasElement) {
      canvasElement.addEventListener("mousemove", handleMouseMove);
    }

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial calculation

    return () => {
      if (canvasElement) {
        canvasElement.removeEventListener("mousemove", handleMouseMove);
      }
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <section ref={sectionRef} id="about" className="relative py-24 px-4 md:py-32 overflow-hidden bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-[#0a0e1a] dark:via-[#0d0f14] dark:to-[#050608]">
      {/* Minimal Background with Subtle Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/30 dark:from-[#0a0e1a] dark:via-[#0d0f14] dark:to-[#050608]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(59,130,246,0.1)_0%,_transparent_50%)] dark:bg-[radial-gradient(ellipse_at_top,_rgba(59,130,246,0.03)_0%,_transparent_50%)]"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20 md:mb-24">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
            About Me
          </h2>
          <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-blue-600 dark:via-blue-400 to-transparent mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* 3D Model Section */}
          <div 
            ref={canvasRef}
            className="w-full h-[400px] md:h-[500px] lg:h-[600px] rounded-xl overflow-hidden bg-gradient-to-br from-blue-100/50 to-purple-100/50 dark:from-[rgba(59,130,246,0.05)] dark:to-[rgba(139,92,246,0.05)] backdrop-blur-sm border border-blue-200/50 dark:border-[rgba(255,255,255,0.05)]"
          >
            <Canvas camera={{ position: [0, 1.5, 6], fov: 45 }}>
              <Scene mousePosition={mousePosition} scrollProgress={scrollProgress} />
            </Canvas>
          </div>

          {/* Content Section */}
          <div className="space-y-6">
            <div className="relative">
              {/* Subtle glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 rounded-2xl blur-xl"></div>
              
              <div className="relative bg-white/80 dark:bg-[rgba(255,255,255,0.02)] backdrop-blur-sm p-8 md:p-10 lg:p-12 rounded-2xl border border-gray-200 dark:border-[rgba(255,255,255,0.08)] shadow-lg dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
                <div className="space-y-6 text-lg md:text-xl text-gray-700 dark:text-gray-200 leading-relaxed">
                  <p className="font-light">
                    I'm a passionate <span className="text-blue-600 dark:text-blue-400 font-medium">Software Engineer</span> focused on building reliable, user-friendly web and mobile applications. I enjoy working across the full development process, from understanding requirements to delivering polished solutions.
                  </p>
                  <p className="font-light">
                    I'm driven by <span className="text-purple-600 dark:text-purple-400 font-medium">problem-solving</span>, <span className="text-blue-600 dark:text-blue-400 font-medium">continuous learning</span>, and creating products that make a real impact.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
