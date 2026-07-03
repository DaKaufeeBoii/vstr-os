import { experiences } from "@/data/experience";
import { projects } from "@/data/projects";
import { skills } from "@/data/skills";
import { achievements } from "@/data/achievements";

export const RESUME = {
  name: "Sai Tarun Reddy Velagala",
  title: "CS Undergrad & AI Developer",
  email: "saitarunrdy@gmail.com",
  phone: "+91 7043692980",
  location: "Hyderabad, Telangana, India",
  education: {
    school: "KG Reddy College of Engineering & Technology",
    degree: "B.Tech CSE (AI & ML)",
    graduation: "Expected 2027",
    cgpa: "8.41",
  },
  summary:
    "Computer Science undergraduate specializing in AI and full-stack development. " +
    "Experienced building web applications, AI-powered tools, and interactive UIs. " +
    "Hackathon winner with leadership experience in student technical communities.",
  links: {
    linkedin: "https://linkedin.com/in/sai-tarun-reddy-velagala-24135229b/",
    github: "https://github.com/DaKaufeeBoii",
  },
  experiences,
  projects,
  skills,
  achievements,
};
