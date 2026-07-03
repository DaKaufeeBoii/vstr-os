import { Project } from "@/types";

export const projects: Project[] = [
  {
    title: "VSTR-OS",
    subtitle: "Interactive OS Portfolio",
    description:
      "A custom desktop environment portfolio with draggable windows, a terminal, hidden mini-games, and theme switching — built to showcase full-stack UI engineering.",
    highlights: [
      "Custom window manager with drag, minimize, focus stacking, and taskbar",
      "14 interactive apps including terminal easter eggs and canvas games",
      "Three themes, mobile fullscreen windows, and persisted user preferences",
    ],
    stack: ["Next.js", "React 19", "TypeScript", "Framer Motion", "Tailwind CSS"],
    github: "https://github.com/DaKaufeeBoii/vstr-os",
    icon: "🖥️",
  },
  {
    title: "EventOS",
    subtitle: "Event Management Platform",
    description:
      "Full-stack event management platform for organizing campus events with registration flows, responsive UI, and Firebase-backed data storage.",
    highlights: [
      "Responsive organizer and attendee interfaces built with Next.js",
      "Firebase integration for auth and real-time event data",
      "Deployed on Vercel with collaborative GitHub-based workflow",
    ],
    stack: ["Next.js", "React", "Tailwind CSS", "Firebase", "Vercel"],
    icon: "🎪",
  },
  {
    title: "MailGenius",
    subtitle: "AI Email Automation Tool",
    description:
      "Python-based email assistant that drafts professional messages from bullet inputs using NLP and prompt engineering techniques.",
    highlights: [
      "Automates repetitive email drafting for common professional scenarios",
      "NLP pipeline with configurable prompt templates",
      "REST API design for integration with external tools",
    ],
    stack: ["Python", "NLP", "Prompt Engineering", "REST APIs"],
    icon: "✉️",
  },
  {
    title: "EchoLens",
    subtitle: "Real-Time Sentiment Tracking Dashboard",
    description:
      "Sentiment analysis dashboard that visualizes opinion trends in real time, combining Python NLP backends with a React frontend.",
    highlights: [
      "Processes and classifies text streams for sentiment scoring",
      "Interactive charts for trend visualization and filtering",
      "Modular pipeline separating data ingestion from UI layer",
    ],
    stack: ["Python", "NLP", "Data Visualization", "React"],
    icon: "📡",
  },
];
