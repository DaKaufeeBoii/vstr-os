import { Project } from "@/types";

export const projects: Project[] = [
  {
    title: "VSTR-OS",
    category: "Web & Interface Systems",
    featured: true,
    subtitle: "Interactive OS Portfolio",
    description:
      "An interactive desktop-style portfolio with draggable windows, a terminal, mini-games, theme switching, and video wallpapers.",
    highlights: [
      "Custom window manager with drag, minimize, focus stacking, and taskbar",
      "Built-in portfolio apps, terminal commands, and mini-games",
      "Multiple themes, mobile layouts, persisted preferences, and live video wallpapers",
    ],
    stack: ["Next.js", "React 19", "TypeScript", "Framer Motion", "Tailwind CSS"],
    github: "https://github.com/DaKaufeeBoii/vstr-os",
    demo: "https://vstr-os.vercel.app",
  },
  {
    title: "EventOS",
    category: "Web Applications",
    subtitle: "Event Management Platform",
    description:
      "Campus event platform built for the CodeQuesters Summer Hackathon. See the repository and live project for current functionality.",
    highlights: [
      "Responsive organizer and attendee interfaces built with Next.js",
    ],
    stack: ["Next.js"],
    github: "https://github.com/DaKaufeeBoii/eventos",
    demo: "https://eventos-iota-beige.vercel.app",
  },
  {
    title: "BharatVaani",
    category: "AI & Local-First Applications",
    featured: true,
    subtitle: "Offline Translation App for Indian Languages",
    description:
      "A fully offline Android app for translating between Indian languages using Google's ML Kit. Supports English, Hindi, Telugu, Tamil, Marathi, and more with voice input/output capabilities.",
    highlights: [
      "A modern, beautiful and responsive Kotlin Jetpack Compose UI",
      "Offline translation using ML Kit",
      "Voice input/output",
      "Supports STT and TTS using Vosk"
    ],
    stack: ["Kotlin", "Android", "ML Kit", "Vosk"],
    github: "https://github.com/DaKaufeeBoii/BharatVaani-Offline",
  },
  {
    title: "DropPin",
    category: "Location & Utility Apps",
    subtitle: "Location Sharing App",
    description:
      "A full-stack location sharing platform for users to share their live location with delivery persons and vice versa.",
    highlights: [
      "Real-time location sharing between users",
      "Google Maps integration for location tracking",
      "Secure with Supabase auth and database",
      "Responsive design for mobile",
      "Simple and intuitive UI",
      "Pin drop functionality to save locations"
    ],
    stack: ["Next.js", "React", "Tailwind CSS", "Supabase"],
    github: "https://github.com/DaKaufeeBoii/DropPin",
  },
  {
    title: "ProjectPulse",
    category: "AI & Full-Stack Applications",
    featured: true,
    subtitle: "AI-Powered Project Management Tool",
    description:
      "AI-powered project management app with project tracking, Kanban workflows, budget monitoring, and real-time collaboration.",
    highlights: [
      "Role-based access control and team management",
      "AI project-risk assessment using Mistral AI with rule-based fallback",
      "Project tracking, Kanban workflows, budget tracking, and team chat",
    ],
    stack: ["Next.js 14", "PostgreSQL", "Prisma", "Mistral AI", "Tailwind CSS"],
    github: "https://github.com/DaKaufeeBoii/ProjectPulse",
    demo: "https://project-pulse-ver2.vercel.app",
  },
  {
    title: "Kaufee-Home",
    category: "AI & Local-First Applications",
    featured: true,
    subtitle: "Privacy-first local desktop AI agent",
    description:
      "A Windows desktop assistant using a local Ollama model for file search, application launching, system monitoring, and filesystem tasks, with permission-gated actions and voice workflows.",
    highlights: [
      "Local model runtime through Ollama",
      "SQLite full-text search for file discovery",
      "Permission checks for sensitive file and system actions",
    ],
    stack: ["Python", "Ollama", "SQLite", "Local Speech Recognition", "Text-to-Speech"],
    github: "https://github.com/DaKaufeeBoii/Kaufee-Home",
  },
  {
    title: "LogicBlitz",
    category: "Web Applications",
    subtitle: "Quiz Hosting Platform",
    description:
      "A quiz hosting platform for students to compete in quizzes.",
    highlights: [
      "Responsive interfaces built with TypeScript",
      "Supabase integration for auth and real-time user and quiz data",
    ],
    stack: ["HTML", "JavaScript", "CSS", "Vercel", "TypeScript", "Supabase"],
    github: "https://github.com/DaKaufeeBoii/LogicBlitz",
    demo: "https://logic-blitz.vercel.app",
  },
  {
    title: "Multi-Buzzer",
    category: "Games & Interactive Tools",
    subtitle: "Quiz Buzzer Platform",
    description:
      "A quiz buzzer platform for students to compete in quizzes.",
    highlights: [
      "Responsive interfaces built with Python",
      "Real-time synchronization across all devices using Socket.io",
      "Customizable room settings and team options",
    ],
    stack: ["Python", "Custom Tkinter", "Socket.io"],
    github: "https://github.com/DaKaufeeBoii/Multi-Buzzer",
    demo: "https://dakaufeeboii.itch.io/multi-buzzer",
  },
  {
    title: "HeartFund",
    category: "Web Applications",
    subtitle: "Fundraising Platform",
    description:
      "Full-stack community fundraising platform enabling users to create and manage charitable campaigns.",
    highlights: [
      "Dynamic campaign creation and contribution tracking",
      "Responsive user interface built with Next.js and Tailwind CSS",
      "Secure authentication and data persistence backed by Supabase",
    ],
    stack: ["Next.js", "React", "Tailwind CSS", "Supabase", "Shadcn UI"],
    github: "https://github.com/DaKaufeeBoii/heartfund-fundraising",
    demo: "https://heartfund-fundraising.vercel.app",
  },
  {
    title: "Mission DRONA",
    category: "Mobile Applications",
    subtitle: "Expo app for Product Design and Development course.",
    description:
      "An expo app for natural disaster victims and volunteers to order or deliver food, water and medicine at the requested location.",
    highlights: [
      "Made a simple and intuitive UI/UX for the app",
      "Created so that victims are connected to the nearest volunteers",
      "Also helps halt the use of fossil fuels in helicopters and other transport vehicles",
    ],
    stack: ["React Native", "Expo", "Firebase", "Google Maps API"],
    github: "https://github.com/DaKaufeeBoii/mission-drona-EXPO",
  },
  {
    title: "Disease-Inc",
    category: "Games & Interactive Tools",
    subtitle: "Interactive Pandemic Strategy Simulation",
    description:
      "A web-based simulation inspired by Plague Inc. featuring animated infection dynamics and state visualization.",
    highlights: [
      "Interactive browser simulation exploring disease propagation mechanics using Canvas and ES6",
      "Dynamic transmission algorithms with configurable mutation and virulence traits",
      "Deployed on Vercel with responsive mobile-ready layout",
    ],
    stack: ["HTML", "CSS", "JavaScript", "Vercel"],
    github: "https://github.com/DaKaufeeBoii/disease-inc",
    demo: "https://disease-inc.vercel.app",
  },
  {
    title: "RAG Model",
    category: "AI & Full-Stack Applications",
    subtitle: "Retrieval-Augmented Generation Model",
    description:
      "A RAG model that can answer questions based on the documents provided.",
    highlights: [
      "Retrieval augmented generation using LlamaIndex",
      "Vector DB using Pinecone",
      "LangChain to build the RAG pipeline",
      "Using Streamlit for the UI"
    ],
    stack: ["Python", "RAG", "LLM", "TensorFlow"],
    github: "https://github.com/DaKaufeeBoii/RAG-pipeline-STuTribe",
  },
  {
    title: "Multiplayer Pong",
    category: "Games & Interactive Tools",
    subtitle: "Real-time multiplayer pong game",
    description:
      "A simple multiplayer pong game built using Next.js and Socket.IO.",
    highlights: [
      "Real-time multiplayer gameplay",
      "Simple and intuitive UI",
    ],
    stack: ["Next.js", "React", "Tailwind CSS", "Socket.IO", "Vercel"],
    github: "https://github.com/DaKaufeeBoii/pong-room-test",
  },
  {
    title: "Historytales.ai",
    category: "AI & Full-Stack Applications",
    subtitle: "Fictional historical story generator.",
    description:
      "A website that generates stories based on the user prompts.",
    highlights: [
      "Uses Generative AI models to generate a story based on user inputs and prompts.",
      "Deployed on Vercel"
    ],
    stack: ["Next.js", "React", "Tailwind CSS", "Google Gemini API"],
    github: "https://github.com/DaKaufeeBoii/Historytales.ai",
    demo: "https://historytales-ai.onrender.com",
  },
  {
    title: "PDNF-PCNF Calculator",
    category: "Web Applications",
    subtitle: "PDNF and PCNF calculator webpage",
    description:
      "PDNF and PCNF calculator webpage ( Discrete Mathematics ), made using Python 3.13.",
    highlights: [
      "Calculates PDNF and PCNF for a given boolean function",
      "Converts boolean functions to PDNF and PCNF",
      "Calculates truth tables for boolean functions",
    ],
    stack: ["Python 3.13", "Jinja2", "HTML", "CSS", "JavaScript"],
    github: "https://github.com/DaKaufeeBoii/pdnf-pcnf-web",
    demo: "https://pdnf-pcnf-web.onrender.com",
  },
  {
    title: "MailGenius",
    category: "AI & Full-Stack Applications",
    subtitle: "AI Email Automation Tool",
    description:
      "Python-based email assistant that drafts professional messages from bullet inputs using NLP and prompt engineering techniques.",
    highlights: [
      "Automates repetitive email drafting for common professional scenarios",
      "NLP pipeline with configurable prompt templates",
      "REST API design for integration with external tools",
    ],
    stack: ["Python", "NLP", "Prompt Engineering", "REST APIs"],
    github: "https://github.com/DaKaufeeBoii/mailgenius-buddy",
    demo: "https://mailgenius-buddy.lovable.app",
  },
  {
    title: "EchoLens",
    category: "AI & Full-Stack Applications",
    subtitle: "Real-Time Sentiment Tracking Dashboard",
    description:
      "Sentiment analysis dashboard that visualizes opinion trends in real time, combining Python NLP backends with a React frontend.",
    highlights: [
      "Processes and classifies text streams for sentiment scoring",
      "Interactive charts for trend visualization and filtering",
      "Modular pipeline separating data ingestion from UI layer",
    ],
    stack: ["Python", "NLP", "Data Visualization", "React"],
    github: "https://github.com/DaKaufeeBoii/EchoLens2",
    demo: "https://echolens.lovable.app",
  },
];
