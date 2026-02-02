// src/app/layout.tsx
import "./globals.css"; // Tailwind global styles
import { ReactNode } from "react";
import { Inter } from "next/font/google";
import Navbar from "../components/Navbar"; // Relative import to Navbar

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata = {
  title: "Kalana | Software Engineer",
  description: "Software Engineer portfolio built with Next.js",
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className={`${inter.className} bg-white text-black dark:bg-gray-900 dark:text-white transition-colors duration-300`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
