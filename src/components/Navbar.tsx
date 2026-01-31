// src/components/Navbar.tsx
import React from "react";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 flex justify-between items-center px-6 py-4 border-b bg-white dark:bg-gray-900 backdrop-blur-sm bg-opacity-90">
      <h2 className="font-bold text-xl text-black dark:text-white">Kalana</h2>
      <div className="flex items-center space-x-6">
        <a
          href="#projects"
          className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors duration-200"
        >
          Projects
        </a>
        <a
          href="#contact"
          className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors duration-200"
        >
          Contact
        </a>
      </div>
    </nav>
  );
}
