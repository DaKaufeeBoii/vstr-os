import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Download, Code2, Mail, Phone } from "lucide-react";
import { RESUME } from "@/data/resume";
import { projects } from "@/data/projects";
import RecruiterStyles from "./recruiter.module.css";

export const metadata: Metadata = {
  title: "Portfolio | Sai Tarun Reddy Velagala",
  description: "Professional portfolio, selected projects, skills, experience, and contact information.",
};

const featuredProjects = projects.filter((project) => project.featured);
const resumePdf = "/assets/resume/Sai_Tarun_Reddy_Velagala_Resume.pdf";

export default function RecruiterPage() {
  return (
    <main className={RecruiterStyles.page}>
      <nav className={RecruiterStyles.nav} aria-label="Portfolio navigation">
        <a className={RecruiterStyles.brand} href="#top" aria-label="Sai Tarun portfolio home">VSTR<span>.</span></a>
        <div className={RecruiterStyles.navLinks}>
          <a href="#projects">Projects</a><a href="#experience">Experience</a><a href="#skills">Skills</a><a href="#contact">Contact</a>
        </div>
        <Link className={RecruiterStyles.desktopLink} href="/" aria-label="Return to the interactive VSTR.OS desktop">Open VSTR.OS</Link>
      </nav>

      <section className={RecruiterStyles.hero} id="top">
        <p className={RecruiterStyles.eyebrow}>PORTFOLIO / RECRUITER VIEW</p>
        <h1>{RESUME.name}</h1>
        <p className={RecruiterStyles.role}>{RESUME.title}</p>
        <p className={RecruiterStyles.summary}>{RESUME.summary}</p>
        <div className={RecruiterStyles.heroActions}>
          <a className={RecruiterStyles.primaryButton} href={resumePdf} target="_blank" rel="noreferrer"><Download size={16} /> View resume PDF</a>
          <a className={RecruiterStyles.secondaryButton} href={`mailto:${RESUME.email}`}><Mail size={16} /> Contact</a>
        </div>
        <div className={RecruiterStyles.education}>
          <span>{RESUME.education.school}</span><span>{RESUME.education.degree}</span><span>CGPA {RESUME.education.cgpa} · {RESUME.education.period}</span>
        </div>
      </section>

      <section className={RecruiterStyles.section} id="projects">
        <div className={RecruiterStyles.sectionHeading}><p className={RecruiterStyles.eyebrow}>SELECTED BUILDS</p><h2>Featured projects</h2></div>
        <div className={RecruiterStyles.projectGrid}>
          {featuredProjects.map((project) => (
            <article className={RecruiterStyles.projectCard} key={project.title}>
              <p className={RecruiterStyles.projectCategory}>{project.category}</p>
              <h3>{project.title}</h3><p className={RecruiterStyles.projectSubtitle}>{project.subtitle}</p>
              <p className={RecruiterStyles.projectDescription}>{project.description}</p>
              {project.highlights?.length ? <ul>{project.highlights.map((item) => <li key={item}>{item}</li>)}</ul> : null}
              <div className={RecruiterStyles.techList}>{project.stack.map((item) => <span key={item}>{item}</span>)}</div>
              <div className={RecruiterStyles.projectLinks}>
                {project.github && <a href={project.github} target="_blank" rel="noreferrer"><Code2 size={15} /> Source <ArrowUpRight size={13} /></a>}
                {project.demo && <a href={project.demo} target="_blank" rel="noreferrer">Live demo <ArrowUpRight size={13} /></a>}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={RecruiterStyles.section} id="experience">
        <div className={RecruiterStyles.sectionHeading}><p className={RecruiterStyles.eyebrow}>WORK HISTORY</p><h2>Experience</h2></div>
        <div className={RecruiterStyles.timeline}>
          {RESUME.experiences.map((item) => <article className={RecruiterStyles.experienceCard} key={`${item.organization}-${item.title}`}>
            <div className={RecruiterStyles.experienceTop}><h3>{item.title}</h3><span>{item.period}</span></div><p className={RecruiterStyles.organization}>{item.organization}</p>
            <ul>{item.points.map((point) => <li key={point}>{point}</li>)}</ul>
          </article>)}
        </div>
      </section>

      <section className={RecruiterStyles.section} id="skills">
        <div className={RecruiterStyles.sectionHeading}><p className={RecruiterStyles.eyebrow}>TECHNICAL AREAS</p><h2>Skills</h2></div>
        <div className={RecruiterStyles.skillGrid}>{RESUME.skills.map((group) => <article className={RecruiterStyles.skillGroup} key={group.title}>
          <h3>{group.title}</h3><div>{group.skills.map((skill) => <span key={skill.name}>{skill.name}</span>)}</div>
        </article>)}</div>
      </section>

      <section className={RecruiterStyles.section}>
        <div className={RecruiterStyles.sectionHeading}><p className={RecruiterStyles.eyebrow}>RECOGNITION</p><h2>Achievements</h2></div>
        <div className={RecruiterStyles.awardGrid}>{RESUME.achievements.map((item) => <article className={RecruiterStyles.awardCard} key={item.title}><span>{item.year}</span><h3>{item.title}</h3><p>{item.subtitle}</p></article>)}</div>
      </section>

      <footer className={RecruiterStyles.footer} id="contact">
        <div><p className={RecruiterStyles.eyebrow}>GET IN TOUCH</p><h2>Contact</h2><p>For opportunities and professional inquiries.</p></div>
        <div className={RecruiterStyles.contactLinks}>
          <a href={`mailto:${RESUME.email}`}><Mail size={16} /> {RESUME.email}</a>
          <a href={`tel:${RESUME.phone.replace(/\s/g, "")}`}><Phone size={16} /> {RESUME.phone}</a>
          <a href={RESUME.links.linkedin} target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight size={14} /></a>
          <a href={RESUME.links.github} target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={14} /></a>
        </div>
        <div className={RecruiterStyles.footerBottom}><a href={resumePdf} target="_blank" rel="noreferrer">Resume PDF</a><Link href="/">Back to the interactive desktop</Link><span>VSTR.OS</span></div>
      </footer>
    </main>
  );
}
