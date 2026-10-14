import { experiences } from "@/data/experience";
import { projects } from "@/data/projects";
import { skills } from "@/data/skills";
import { achievements } from "@/data/achievements";

export const RESUME = {
  name: "Sai Tarun Reddy Velagala",
  title: "Computer Science Undergraduate · AI/ML",
  email: "saitarunrdy@gmail.com",
  phone: "+91 7043692980",
  education: {
    school: "KG Reddy College of Engineering and Technology",
    location: "Moinabad, Telangana",
    degree: "Bachelor of Computer Science and Engineering, AI/ML Specialization",
    period: "September 2023 – Present",
    cgpa: "8.49",
  },
  summary:
    "Computer Science undergraduate with a foundation in software development, programming, databases, and problem solving. Experienced building practical software and application development projects.",
  links: {
    linkedin: "https://linkedin.com/in/vstr",
    github: "https://github.com/DaKaufeeBoii",
  },
  experiences,
  projects,
  skills,
  achievements,
};
