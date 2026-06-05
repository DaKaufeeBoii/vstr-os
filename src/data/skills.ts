import { SkillCategory } from "@/types";

export const skills: SkillCategory[] = [
  {
    title: "Languages",
    icon: "⌨️",
    skills: [
      { name: "Python", level: 88 },
      { name: "JavaScript", level: 90 },
      { name: "HTML & CSS", level: 92 },
      { name: "TypeScript", level: 75 },
    ],
  },
  {
    title: "Frontend",
    icon: "🖥️",
    skills: [
      { name: "React.js", level: 88 },
      { name: "Next.js", level: 85 },
      { name: "Tailwind CSS", level: 90 },
    ],
  },
  {
    title: "Backend & Database",
    icon: "🗄️",
    skills: [
      { name: "Firebase", level: 80 },
      { name: "REST APIs", level: 82 },
      { name: "DBMS", level: 72 },
    ],
  },
  {
    title: "AI & ML",
    icon: "🤖",
    skills: [
      { name: "NLP", level: 78 },
      { name: "Prompt Engineering", level: 85 },
      { name: "WatsonX", level: 70 },
      { name: "Chatbot Dev", level: 80 },
    ],
  },
  {
    title: "Tools & Workflow",
    icon: "🛠️",
    skills: [
      { name: "Git & GitHub", level: 88 },
      { name: "Vercel", level: 85 },
      { name: "UI/UX Design", level: 76 },
    ],
  },
];