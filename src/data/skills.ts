import { SkillCategory } from "@/types";

export const skills: SkillCategory[] = [
  {
    title: "Languages & Data",
    icon: "terminal",
    skills: [
      { name: "Python" },
      { name: "SQL" },
      { name: "PostgreSQL" },
      { name: "SQLite" },
    ],
  },
  {
    title: "Web Development",
    icon: "display",
    skills: [
      { name: "React" },
      { name: "Next.js" },
      { name: "REST APIs" },
    ],
  },
  {
    title: "AI & Agent Systems",
    icon: "skills",
    skills: [
      { name: "LLM Applications" },
      { name: "AI Agents" },
      { name: "Retrieval-Augmented Generation" },
      { name: "NLP" },
      { name: "Prompt Engineering" },
      { name: "Tool Calling" },
    ],
  },
  {
    title: "Backend & Data Access",
    icon: "disk",
    skills: [
      { name: "FastAPI" },
      { name: "Supabase" },
    ],
  },
  {
    title: "Project Technologies",
    icon: "settings",
    skills: [
      { name: "Kotlin" },
      { name: "Jetpack Compose" },
      { name: "Prisma" },
      { name: "Mistral AI" },
      { name: "Ollama" },
    ],
  },
  {
    title: "Tools & Collaboration",
    icon: "settings",
    skills: [
      { name: "Git & GitHub" },
      { name: "Vercel" },
      { name: "UI/UX Design" },
    ],
  },
];
