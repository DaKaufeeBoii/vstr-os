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
    demo: "https://vstr-os.vercel.app",
    icon: "🖥️",
  },
  {
    title: "EventOS",
    subtitle: "Event Management Platform",
    description:
      "Full-stack event management platform for organizing campus events with registration flows, responsive UI, and Firebase-backed data storage.",
    highlights: [
      "Responsive organizer and attendee interfaces built with Next.js",
      "Supabase integration for auth and real-time event data",
      "Deployed on Vercel with collaborative GitHub-based workflow",
    ],
    stack: ["Next.js", "React", "Tailwind CSS", "Vercel"],
    github: "https://github.com/DaKaufeeBoii/eventos",
    demo: "https://eventos-em.vercel.app",
    icon: "🎪",
  },
  {
    title: "BharatVaani-Offline",
    subtitle: "Offline Translation App for Indian Languages",
    description:
      "A fully offline Android app for translating between Indian languages using Google's ML Kit. Supports English, Hindi, Telugu, Tamil, Marathi, and more with voice input/output capabilities.",
    highlights: [
      "A modern, beatiful and responsive Kotlin Jetpack Compose UI",
      "Offline translation using ML Kit",
      "Voice input/output",
      "Supports STT and TTS using Vosk"
    ],
    stack: ["Kotlin", "Android", "ML Kit", "Vosk"],
    github: "https://github.com/DaKaufeeBoii/BharatVaani-Offline",
    icon: "🌐",
  },
  {
    title: "DropPin",
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
    icon: "📍",
  },
  {
    title: "ProjectPulse",
    subtitle: "AI-Powered Project Management Tool",
    description:
      "An AI-powered project management tool for teams to track projects, tasks, budgets, and risks.",
    highlights: [
      "Full-stack dashboard with real-time updates and AI-assisted insights",
      "Role-based access (Admin, Teacher, Student) with secure authentication",
      "AI-powered risk analysis and automated progress summaries",
      "Customizable project workflows with milestones, tasks, and subtasks",
      "Integrated budget tracking with expense logging and visual reports",
      "Real-time notifications, team collaboration tools, and file sharing",
    ],
    stack: ["TypeScript", "Vercel", "Supabase", "Google Gemini API", "Google GenAI"],
    github: "https://github.com/DaKaufeeBoii/ProjectPulse",
    demo: "https://project-pulse-ver2.vercel.app",
    icon: "📋",
  },
  {
    title: "LogicBlitz",
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
    icon: "⚡",
  },
  {
    title: "Multi-Buzzer",
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
    icon: "🛎️",
  },
  {
    title: "HeartFund",
    subtitle: "Fundraising Platform",
    description:
      "A fundraising website.",
    highlights: [
      "Uses stock images for the fundraisers",
      "Responsive interfaces built with Next.js",
      "Can create accounts and fundraising posts freely",
    ],
    stack: ["Next.js", "React", "Tailwind CSS", "Supabase", "Shadcn UI"],
    github: "https://github.com/DaKaufeeBoii/heartfund-fundraising",
    demo: "heartfund-fundraising.vercel.app",
    icon: "💕",
  },
  {
    title: "Mission DRONA",
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
    icon: "🚁",
  },
  {
    title: "Disease-Inc",
    subtitle: "An AI generated clone of the game Plague Inc.",
    description:
      "A web based clone of the game Plague Inc. with decent UI and animations.",
    highlights: [
      "Built in under 5 hours using ChatGPT.",
      "Deployed on Vercel",
    ],
    stack: ["HTML", "CSS", "JavaScript", "Vercel"],
    github: "https://github.com/DaKaufeeBoii/disease-inc",
    demo: "disease-inc.vercel.app",
    icon: "🦠",
  },
  {
    title: "RAG Model",
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
    icon: "🤖🧠",
  },
  {
    title: "Multiplayer Pong",
    subtitle: "Real-time multiplayer pong game",
    description:
      "A simple multiplayer pong game built using Next.js and Socket.IO.",
    highlights: [
      "Real-time multiplayer gameplay",
      "Simple and intuitive UI",
    ],
    stack: ["Next.js", "React", "Tailwind CSS", "Socket.IO", "Vercel"],
    github: "https://github.com/DaKaufeeBoii/pong-room-test",
    icon: "⚪",
  },
  {
    title: "Historytales.ai",
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
    icon: "📚",
  },
  {
    title: "PDNF-PCNF Calculator",
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
    icon: "➕➖✖️➗",
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
    github: "https://github.com/DaKaufeeBoii/mailgenius-buddy",
    demo: "https://mailgenius-buddy.lovable.app",
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
    github: "https://github.com/DaKaufeeBoii/EchoLens2",
    demo: "https://echolens.lovable.app",
    icon: "📡",
  },
];
