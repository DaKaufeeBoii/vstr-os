import type { Metadata } from "next";
import ResumeToolbar from "@/components/resume/ResumeToolbar";
import { RESUME } from "@/data/resume";
import "./resume.css";

export const metadata: Metadata = {
  title: "Resume | Sai Tarun Reddy Velagala",
  description: "Resume of Sai Tarun Reddy Velagala — CS Undergrad & AI Developer.",
};

export default function ResumePage() {
  const { name, title, email, phone, location, education, summary, links, experiences, projects, skills, achievements } = RESUME;

  return (
    <div className="resume-page">
      <ResumeToolbar />

      <article className="resume-document">
        <header className="resume-header">
          <h1>{name}</h1>
          <p className="resume-title">{title}</p>
          <p className="resume-contact">
            {email} · {phone} · {location}
            <br />
            <a href={links.linkedin}>LinkedIn</a> · <a href={links.github}>GitHub</a>
          </p>
        </header>

        <section>
          <h2>Summary</h2>
          <p>{summary}</p>
        </section>

        <section>
          <h2>Education</h2>
          <p><strong>{education.school}</strong></p>
          <p>{education.degree} · CGPA {education.cgpa} · {education.graduation}</p>
        </section>

        <section>
          <h2>Experience & Leadership</h2>
          {experiences.map((exp) => (
            <div key={exp.title} className="resume-entry">
              <div className="resume-entry-head">
                <strong>{exp.title}</strong>
                <span>{exp.period}</span>
              </div>
              <p className="resume-org">{exp.organization}</p>
              <ul>
                {exp.points.map((pt) => (
                  <li key={pt}>{pt}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <section>
          <h2>Projects</h2>
          {projects.map((proj) => (
            <div key={proj.title} className="resume-entry">
              <div className="resume-entry-head">
                <strong>{proj.title}</strong>
                {proj.github && (
                  <a href={proj.github} target="_blank" rel="noopener noreferrer">
                    {proj.github.replace("https://github.com/", "")}
                  </a>
                )}
              </div>
              <p className="resume-org">{proj.subtitle}</p>
              <p>{proj.description}</p>
              {proj.highlights && (
                <ul>
                  {proj.highlights.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
              )}
              <p className="resume-stack">{proj.stack.join(" · ")}</p>
            </div>
          ))}
        </section>

        <section>
          <h2>Skills</h2>
          {skills.map((cat) => (
            <p key={cat.title}>
              <strong>{cat.title}:</strong> {cat.skills.map((s) => s.name).join(", ")}
            </p>
          ))}
        </section>

        <section>
          <h2>Achievements</h2>
          {achievements.map((a) => (
            <div key={a.title} className="resume-entry">
              <div className="resume-entry-head">
                <strong>{a.title}</strong>
                <span>{a.year}</span>
              </div>
              <p className="resume-org">{a.subtitle}</p>
              <p>{a.description}</p>
            </div>
          ))}
        </section>
      </article>
    </div>
  );
}
