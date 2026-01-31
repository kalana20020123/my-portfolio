"use client";

import React from "react";
import Image from "next/image";

interface Project {
  name: string;
  description: string;
  techStack: string[];
  image: string;
  githubUrl?: string;
  liveUrl?: string;
}

const projects: Project[] = [
  {
    name: "Finance Tracker Mobile Application",
    description:
      "A comprehensive mobile application for tracking personal finances and managing budgets with intuitive user interface.",
    techStack: ["Kotlin", "XML", "Shared Preferences"],
    image: "/images/project1.png",
    githubUrl: "#",
    liveUrl: "#",
  },
  {
    name: "Beauty Products Platform",
    description:
      "A full-stack e-commerce platform for beauty products featuring product catalog, user authentication, and secure payment processing.",
    techStack: ["React.js", "Express.js", "Node.js", "Tailwind CSS", "MongoDB"],
    image: "/images/project2.jpg",
    githubUrl: "#",
    liveUrl: "#",
  },
  {
    name: "My Portfolio",
    description:
      "A modern, responsive portfolio website showcasing projects and skills with smooth animations, 3D elements, and interactive components.",
    techStack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Three.js"],
    image: "/images/project3.png",
    githubUrl: "#",
    liveUrl: "#",
  },
];

export default function Projects() {
  return (
    <section id="projects" className="relative py-24 px-4 md:py-32 overflow-hidden">
      {/* Background matching portfolio style */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0e1a] via-[#0d0f14] to-[#050608]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(59,130,246,0.03)_0%,_transparent_50%)]"></div>
      
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-20">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
            Projects
          </h2>
          <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent mx-auto"></div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {projects.map((project, index) => (
            <div
              key={index}
              className="group relative bg-[rgba(255,255,255,0.02)] backdrop-blur-sm rounded-xl border border-[rgba(255,255,255,0.08)] hover:border-[rgba(59,130,246,0.3)] transition-all duration-300 hover:bg-[rgba(59,130,246,0.05)] hover:shadow-[0_8px_32px_rgba(59,130,246,0.15)] hover:-translate-y-1 overflow-hidden flex flex-col"
            >
              {/* Project Image */}
              <div className="relative w-full flex items-center justify-center overflow-hidden bg-[rgba(0,0,0,0.2)] p-4">
                <div className="relative w-full">
                  <Image
                    src={project.image}
                    alt={project.name}
                    width={800}
                    height={600}
                    className="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    unoptimized
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.6)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>

              {/* Project Content */}
              <div className="p-6 md:p-8 flex flex-col flex-1">
                {/* Project Name */}
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors duration-300">
                  {project.name}
                </h3>

                {/* Description */}
                <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-6 flex-1">
                  {project.description}
                </p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.techStack.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="px-3 py-1.5 bg-[rgba(59,130,246,0.1)] border border-[rgba(59,130,246,0.2)] text-blue-300 rounded-lg text-xs md:text-sm font-medium group-hover:bg-[rgba(59,130,246,0.15)] group-hover:border-[rgba(59,130,246,0.3)] transition-all duration-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-auto">
                  <a
                    href={project.githubUrl}
                    className="flex-1 px-4 py-2.5 bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(59,130,246,0.2)] border border-[rgba(255,255,255,0.1)] hover:border-[rgba(59,130,246,0.4)] text-white text-sm font-medium rounded-lg transition-all duration-300 text-center hover:shadow-[0_4px_12px_rgba(59,130,246,0.2)]"
                  >
                    GitHub
                  </a>
                  <a
                    href={project.liveUrl}
                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 border border-[rgba(59,130,246,0.3)] hover:border-[rgba(59,130,246,0.5)] text-white text-sm font-medium rounded-lg transition-all duration-300 text-center hover:shadow-[0_4px_12px_rgba(59,130,246,0.3)]"
                  >
                    Live Demo
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
