// src/components/Projects.tsx
import React from "react";

interface Project {
  name: string;
  description: string;
  techStack: string[];
}

const projects: Project[] = [
  {
    name: "E-Commerce Platform",
    description:
      "A full-stack e-commerce platform built with Next.js, featuring user authentication, product management, and payment integration.",
    techStack: ["Next.js", "React", "Node.js", "MongoDB", "Tailwind"],
  },
  {
    name: "Task Management App",
    description:
      "A collaborative task management application with real-time updates, drag-and-drop functionality, and team collaboration features.",
    techStack: ["React", "Node.js", "MongoDB", "Socket.io", "Tailwind"],
  },
  {
    name: "Portfolio Website",
    description:
      "A modern, responsive portfolio website showcasing projects and skills with smooth animations and dark mode support.",
    techStack: ["Next.js", "TypeScript", "Tailwind", "Framer Motion"],
  },
];

export default function Projects() {
  return (
    <section id="projects" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-black dark:text-white mb-12">
          Projects
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-200 border border-gray-200 dark:border-gray-700"
            >
              <h3 className="text-2xl font-bold text-black dark:text-white mb-3">
                {project.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

