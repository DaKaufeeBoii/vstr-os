import { SkillCategory } from "@/types";

export const skills: SkillCategory[] = [
  {
    title: "Languages",
    icon: "terminal",
    skills: [
      { name: "Python" },
      { name: "JavaScript" },
      { name: "HTML & CSS" },
      { name: "TypeScript" },
    ],
  },
  {
    title: "Frontend",
    icon: "display",
    skills: [
      { name: "React.js" },
      { name: "Next.js" },
      { name: "Tailwind CSS" },
    ],
  },
  {
    title: "Backend & Database",
    icon: "disk",
    skills: [
      { name: "Firebase" },
      { name: "REST APIs" },
      { name: "DBMS" },
    ],
  },
  {
    title: "AI & ML",
    icon: "settings",
    skills: [
      { name: "NLP" },
      { name: "Prompt Engineering" },
      { name: "WatsonX" },
      { name: "Chatbot Dev" },
    ],
  },
  {
    title: "Tools & Workflow",
    icon: "settings",
    skills: [
      { name: "Git & GitHub" },
      { name: "Vercel" },
      { name: "UI/UX Design" },
    ],
  },
];