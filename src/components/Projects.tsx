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
    githubUrl: "https://github.com/kalana20020123/Finance-tracker-app",
    liveUrl: "#",
  },
  {
    name: "Beauty Products Platform",
    description:
      "A full-stack e-commerce platform for beauty products featuring product catalog, user authentication, and secure payment processing.",
    techStack: ["React.js", "Express.js", "Node.js", "Tailwind CSS", "MongoDB"],
    image: "/images/project2.jpg",
    githubUrl: "https://github.com/kalana20020123/Beauty-Products-Platform",
    liveUrl: "https://beauty-products-platform.vercel.app/",
  },
  {
    name: "My Portfolio",
    description:
      "A modern, responsive portfolio website showcasing projects and skills with smooth animations, 3D elements, and interactive components.",
    techStack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Three.js"],
    image: "/images/project3.png",
    githubUrl: "https://github.com/kalana20020123/my-portfolio",
    liveUrl: "https://my-portfolio20020223.vercel.app/",
  },
];

const upcomingProjects: Project[] = [
  {
    name: "PDF to Word Converter",
    description:
      "A powerful web application for converting PDF documents to editable Word format with high accuracy and formatting preservation.",
    techStack: ["Next.js", "TypeScript", "PDF.js", "docx", "Tailwind CSS"],
    image: "/images/project1.png", // Placeholder - you can add specific images later
    githubUrl: "#",
    liveUrl: "#",
  },
  {
    name: "AI Resume Analyzer & Job Matcher",
    description:
      "An intelligent platform that analyzes resumes using AI, provides improvement suggestions, and matches candidates with relevant job opportunities.",
    techStack: ["React", "Node.js", "OpenAI API", "MongoDB", "Express.js"],
    image: "/images/project2.jpg", // Placeholder - you can add specific images later
    githubUrl: "#",
    liveUrl: "#",
  },
];

export default function Projects() {
  return (
    <section id="projects" className="relative py-24 px-4 md:py-32 overflow-hidden bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-[#0a0e1a] dark:via-[#0d0f14] dark:to-[#050608]">
      {/* Background matching portfolio style */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/30 dark:from-[#0a0e1a] dark:via-[#0d0f14] dark:to-[#050608]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(59,130,246,0.1)_0%,_transparent_50%)] dark:bg-[radial-gradient(ellipse_at_top,_rgba(59,130,246,0.03)_0%,_transparent_50%)]"></div>
      
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-20">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
            Projects
          </h2>
          <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-blue-600 dark:via-blue-400 to-transparent mx-auto"></div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {projects.map((project, index) => (
            <div
              key={index}
              className="group relative bg-white/80 dark:bg-[rgba(255,255,255,0.02)] backdrop-blur-sm rounded-xl border border-gray-200 dark:border-[rgba(255,255,255,0.08)] hover:border-blue-400 dark:hover:border-[rgba(59,130,246,0.3)] transition-all duration-300 hover:bg-blue-50/50 dark:hover:bg-[rgba(59,130,246,0.05)] hover:shadow-xl dark:hover:shadow-[0_8px_32px_rgba(59,130,246,0.15)] hover:-translate-y-1 overflow-hidden flex flex-col"
            >
              {/* Project Image */}
              <div className="relative w-full flex items-center justify-center overflow-hidden bg-gray-100 dark:bg-[rgba(0,0,0,0.2)] p-4">
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
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 dark:from-[rgba(0,0,0,0.6)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>

              {/* Project Content */}
              <div className="p-6 md:p-8 flex flex-col flex-1">
                {/* Project Name */}
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                  {project.name}
                </h3>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base leading-relaxed mb-6 flex-1">
                  {project.description}
                </p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.techStack.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="px-3 py-1.5 bg-blue-100 dark:bg-[rgba(59,130,246,0.1)] border border-blue-300 dark:border-[rgba(59,130,246,0.2)] text-blue-700 dark:text-blue-300 rounded-lg text-xs md:text-sm font-medium group-hover:bg-blue-200 dark:group-hover:bg-[rgba(59,130,246,0.15)] group-hover:border-blue-400 dark:group-hover:border-[rgba(59,130,246,0.3)] transition-all duration-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-auto">
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-[rgba(255,255,255,0.05)] hover:bg-gray-200 dark:hover:bg-[rgba(59,130,246,0.2)] border border-gray-300 dark:border-[rgba(255,255,255,0.1)] hover:border-gray-400 dark:hover:border-[rgba(59,130,246,0.4)] text-gray-900 dark:text-white text-sm font-medium rounded-lg transition-all duration-300 text-center hover:shadow-md dark:hover:shadow-[0_4px_12px_rgba(59,130,246,0.2)]"
                  >
                    GitHub
                  </a>
                  <a
                    href={project.liveUrl === "#" ? "#" : project.liveUrl}
                    target={project.liveUrl === "#" ? "_self" : "_blank"}
                    rel={project.liveUrl === "#" ? "" : "noopener noreferrer"}
                    className={`flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 dark:from-blue-500/20 dark:to-purple-500/20 dark:hover:from-blue-500/30 dark:hover:to-purple-500/30 border border-blue-400 dark:border-[rgba(59,130,246,0.3)] hover:border-blue-500 dark:hover:border-[rgba(59,130,246,0.5)] text-white text-sm font-medium rounded-lg transition-all duration-300 text-center hover:shadow-lg dark:hover:shadow-[0_4px_12px_rgba(59,130,246,0.3)] ${
                      project.liveUrl === "#" ? "opacity-60 cursor-not-allowed" : ""
                    }`}
                    onClick={project.liveUrl === "#" ? (e) => e.preventDefault() : undefined}
                  >
                    Live Demo
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Upcoming Projects Section */}
        {upcomingProjects.length > 0 && (
          <>
            <div className="text-center mt-24 md:mt-32 mb-16 md:mb-20">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
                Upcoming Projects
              </h2>
              <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-purple-600 dark:via-purple-400 to-transparent mx-auto"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {upcomingProjects.map((project, index) => (
                <div
                  key={index}
                  className="group relative bg-white/80 dark:bg-[rgba(255,255,255,0.02)] backdrop-blur-sm rounded-xl border border-gray-200 dark:border-[rgba(255,255,255,0.08)] hover:border-purple-400 dark:hover:border-[rgba(168,85,247,0.3)] transition-all duration-300 hover:bg-purple-50/50 dark:hover:bg-[rgba(168,85,247,0.05)] hover:shadow-xl dark:hover:shadow-[0_8px_32px_rgba(168,85,247,0.15)] hover:-translate-y-1 overflow-hidden flex flex-col opacity-90"
                >
                  {/* Coming Soon Badge */}
                  <div className="absolute top-4 right-4 z-20">
                    <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full shadow-lg">
                      Coming Soon
                    </span>
                  </div>

                  {/* Project Content */}
                  <div className="p-6 md:p-8 flex flex-col flex-1">
                    {/* Project Name */}
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                      {project.name}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base leading-relaxed mb-6 flex-1">
                      {project.description}
                    </p>

                    {/* Action Buttons - Disabled for upcoming projects */}
                    <div className="flex gap-3 mt-auto">
                      <button
                        disabled
                        className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-[rgba(255,255,255,0.05)] border border-gray-300 dark:border-[rgba(255,255,255,0.1)] text-gray-400 dark:text-gray-500 text-sm font-medium rounded-lg cursor-not-allowed opacity-50"
                      >
                        GitHub
                      </button>
                      <button
                        disabled
                        className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-500/50 to-pink-500/50 border border-purple-400/50 dark:border-[rgba(168,85,247,0.3)] text-white/50 text-sm font-medium rounded-lg cursor-not-allowed opacity-50"
                      >
                        Live Demo
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
