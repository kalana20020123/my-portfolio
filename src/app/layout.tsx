// src/app/layout.tsx
import "./globals.css"; // Tailwind global styles
import { ReactNode } from "react";
import { Inter } from "next/font/google";
import { Metadata } from "next";
import Navbar from "../components/Navbar"; // Relative import to Navbar

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://kalanasandeep.dev"),
  title: {
    default: "Kalana Sandeep | Software Engineer & Full-Stack Developer",
    template: "%s | Kalana Sandeep",
  },
  description: "Portfolio of Kalana Sandeep - Software Engineer, Full-Stack Developer, and Web & Mobile Application Developer. Specialized in modern web technologies, React, Next.js, and building scalable applications.",
  keywords: [
    "Kalana Sandeep",
    "Software Engineer",
    "Full-Stack Developer",
    "Web Developer",
    "Mobile Developer",
    "React Developer",
    "Next.js Developer",
    "TypeScript Developer",
    "JavaScript Developer",
    "Frontend Developer",
    "Backend Developer",
    "Portfolio",
    "Web Development",
    "Software Development",
    "Application Development",
    "UI/UX Developer",
    "Modern Web Technologies",
  ],
  authors: [
    {
      name: "Kalana Sandeep",
    },
  ],
  creator: "Kalana Sandeep",
  publisher: "Kalana Sandeep",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Kalana Sandeep Portfolio",
    title: "Kalana Sandeep | Software Engineer & Full-Stack Developer",
    description: "Portfolio of Kalana Sandeep - Software Engineer, Full-Stack Developer, and Web & Mobile Application Developer. Specialized in modern web technologies, React, Next.js, and building scalable applications.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Kalana Sandeep - Software Engineer Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kalana Sandeep | Software Engineer & Full-Stack Developer",
    description: "Portfolio of Kalana Sandeep - Software Engineer, Full-Stack Developer, and Web & Mobile Application Developer.",
    images: ["/og-image.png"],
    creator: "@kalanasandeep",
  },
  alternates: {
    canonical: "/",
  },
  category: "Portfolio",
  classification: "Software Engineering Portfolio",
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
