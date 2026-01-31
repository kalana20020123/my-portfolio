"use client";

import React from "react";
import {
  SiJavascript,
  SiPython,
  SiKotlin,
  SiPhp,
  SiHtml5,
  SiCss3,
  SiReact,
  SiNextdotjs,
  SiExpo,
  SiSpring,
  SiNodedotjs,
  SiExpress,
  SiMongodb,
  SiMysql,
  SiPostgresql,
  SiFirebase,
} from "react-icons/si";
import { FaJava, FaCode } from "react-icons/fa";

interface Skill {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const skills: Skill[] = [
  { name: "Java", icon: FaJava, color: "#ED8B00" },
  { name: "JavaScript", icon: SiJavascript, color: "#F7DF1E" },
  { name: "Python", icon: SiPython, color: "#3776AB" },
  { name: "C", icon: FaCode, color: "#A8B9CC" },
  { name: "Kotlin", icon: SiKotlin, color: "#7F52FF" },
  { name: "PHP", icon: SiPhp, color: "#777BB4" },
  { name: "HTML", icon: SiHtml5, color: "#E34F26" },
  { name: "CSS", icon: SiCss3, color: "#1572B6" },
  { name: "React.js", icon: SiReact, color: "#61DAFB" },
  { name: "Next.js", icon: SiNextdotjs, color: "#FFFFFF" },
  { name: "React Native (Expo)", icon: SiExpo, color: "#000020" },
  { name: "Spring Boot", icon: SiSpring, color: "#6DB33F" },
  { name: "Node.js", icon: SiNodedotjs, color: "#339933" },
  { name: "Express.js", icon: SiExpress, color: "#FFFFFF" },
  { name: "MongoDB", icon: SiMongodb, color: "#47A248" },
  { name: "MySQL", icon: SiMysql, color: "#4479A1" },
  { name: "PostgreSQL", icon: SiPostgresql, color: "#336791" },
  { name: "Firebase", icon: SiFirebase, color: "#FFCA28" },
];

export default function Skills() {
  return (
    <section id="skills" className="relative py-24 px-4 md:py-32 overflow-hidden bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-[#0a0e1a] dark:via-[#0d0f14] dark:to-[#050608]">
      {/* Background matching portfolio style */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/30 dark:from-[#0a0e1a] dark:via-[#0d0f14] dark:to-[#050608]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(59,130,246,0.1)_0%,_transparent_50%)] dark:bg-[radial-gradient(ellipse_at_top,_rgba(59,130,246,0.03)_0%,_transparent_50%)]"></div>
      
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-20">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
            Skills
          </h2>
          <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-blue-600 dark:via-blue-400 to-transparent mx-auto"></div>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-5">
          {skills.map((skill) => {
            const IconComponent = skill.icon;
            return (
              <div
                key={skill.name}
                className="group relative bg-white/80 dark:bg-[rgba(255,255,255,0.02)] backdrop-blur-sm px-4 py-5 rounded-lg border border-gray-200 dark:border-[rgba(255,255,255,0.08)] hover:border-blue-400 dark:hover:border-[rgba(59,130,246,0.3)] transition-all duration-300 text-center hover:bg-blue-50 dark:hover:bg-[rgba(59,130,246,0.05)] hover:shadow-lg dark:hover:shadow-[0_4px_20px_rgba(59,130,246,0.1)] flex flex-col items-center justify-center gap-2"
              >
                <span 
                  className="text-3xl md:text-4xl transition-all duration-300 group-hover:scale-110 inline-block" 
                  style={{ color: skill.color }}
                >
                  <IconComponent />
                </span>
                <p className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-300">
                  {skill.name}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

