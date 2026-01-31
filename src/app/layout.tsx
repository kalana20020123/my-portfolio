// src/app/layout.tsx
import "./globals.css"; // Tailwind global styles
import { ReactNode } from "react";
import Navbar from "../components/Navbar"; // Relative import to Navbar

export const metadata = {
  title: "Kalana | Software Engineer",
  description: "Software Engineer portfolio built with Next.js",
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className="bg-white text-black dark:bg-gray-900 dark:text-white">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
