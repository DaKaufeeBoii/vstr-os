import { Project } from "@/types";

export const projects: Project[] = [
  {
    title: "EventOS",
    subtitle: "Event Management Platform",
    description:
      "A modern event management platform focused on streamlined event organization and user interaction. Built with a responsive UI, deployment-ready architecture, and collaborative GitHub-based development practices.",
    stack: ["Next.js", "React", "Tailwind CSS", "Firebase", "Vercel"],
    icon: "🎪",
  },
  {
    title: "MailGenius",
    subtitle: "AI Email Automation Tool",
    description:
      "An AI-powered email automation system for generating and managing professional email workflows. Focused on productivity optimization and intelligent response generation using NLP and prompt engineering.",
    stack: ["Python", "NLP", "Prompt Engineering", "REST APIs"],
    icon: "✉️",
  },
  {
    title: "EchoLens",
    subtitle: "Real-Time Sentiment Tracking Dashboard",
    description:
      "A sentiment analysis dashboard capable of tracking and visualizing opinion trends in real time. Applies NLP concepts with an interactive dashboard design for intuitive data interpretation.",
    stack: ["Python", "NLP", "Data Visualization", "React"],
    icon: "📡",
  },
];
