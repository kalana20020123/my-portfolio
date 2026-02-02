// src/app/page.tsx
import { Metadata } from "next";
import Hero from "../components/Hero";
import About from "../components/About";
import Skills from "../components/Skills";
import Projects from "../components/Projects";
import Contact from "../components/Contact";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "Home",
  description: "Welcome to the portfolio of Kalana Sandeep - Software Engineer, Full-Stack Developer, and Web & Mobile Application Developer. Explore my projects, skills, and experience in modern web development.",
  openGraph: {
    title: "Kalana Sandeep | Software Engineer & Full-Stack Developer",
    description: "Welcome to the portfolio of Kalana Sandeep - Software Engineer, Full-Stack Developer, and Web & Mobile Application Developer.",
  },
};

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Contact />
      <Footer />
    </main>
  );
}
