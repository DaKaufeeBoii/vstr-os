"use client";

import React, { useMemo, useState } from "react";
import { ArrowUpRight, BrainCircuit, CalendarDays, ChevronDown, Code2, ExternalLink, FolderKanban, Globe2, MapPin, Monitor, Search } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { projects } from "@/data/projects";
import type { Project } from "@/types";

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  "Web & Interface Systems": Monitor,
  "AI & Full-Stack Applications": BrainCircuit,
  "AI & Local-First Applications": BrainCircuit,
  "Games & Interactive Tools": Code2,
  "Web Applications": Globe2,
  "Mobile Applications": Code2,
  "Location & Utility Apps": MapPin,
  "Events & Tools": CalendarDays,
};

function ProjectTile({ project, expanded, onToggle }: { project: Project; expanded: boolean; onToggle: () => void }) {
  const Icon = CATEGORY_ICONS[project.category ?? ""] ?? FolderKanban;
  return (
    <article className={`project-tile${project.featured ? " featured" : ""}`}>
      <button type="button" className="project-tile-trigger" aria-expanded={expanded} onClick={onToggle}>
        <span className="project-tile-icon"><Icon size={19} aria-hidden="true" /></span>
        <span className="project-tile-copy">
          <span className="project-tile-title">{project.title}{project.featured && <span className="project-featured-tag">FEATURED</span>}</span>
          <span className="project-tile-subtitle">{project.subtitle}</span>
        </span>
        <ChevronDown size={16} className={`project-chevron${expanded ? " open" : ""}`} aria-hidden="true" />
      </button>
      {expanded && (
        <div className="project-tile-details">
          <p>{project.description}</p>
          {project.highlights?.length ? <ul>{project.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul> : null}
          {project.stack.length > 0 && <div className="project-tech-list" aria-label="Technologies">{project.stack.map((item) => <span key={item}>{item}</span>)}</div>}
          <div className="project-links">
            {project.github && <a href={project.github} target="_blank" rel="noreferrer"><Code2 size={14} aria-hidden="true" /> Repository <ArrowUpRight size={13} aria-hidden="true" /></a>}
            {project.demo && <a href={project.demo} target="_blank" rel="noreferrer"><ExternalLink size={14} aria-hidden="true" /> Live demo <ArrowUpRight size={13} aria-hidden="true" /></a>}
          </div>
        </div>
      )}
    </article>
  );
}

export default function ProjectsApp() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All projects");
  const [expanded, setExpanded] = useState<string | null>(null);
  const categories = useMemo(() => ["All projects", ...Array.from(new Set(projects.map((project) => project.category).filter((value): value is string => Boolean(value))))], []);
  const filtered = useMemo(() => projects.filter((project) => {
    const matchesCategory = category === "All projects" || project.category === category;
    const text = `${project.title} ${project.subtitle} ${project.description} ${project.stack.join(" ")}`.toLowerCase();
    return matchesCategory && (!query.trim() || text.includes(query.trim().toLowerCase()));
  }).sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured))), [category, query]);
  const featured = filtered.filter((project) => project.featured);
  const other = filtered.filter((project) => !project.featured);

  const renderTile = (project: Project) => (
    <ProjectTile key={project.title} project={project} expanded={expanded === project.title} onToggle={() => setExpanded(expanded === project.title ? null : project.title)} />
  );

  return (
    <main className="projects-explorer">
      <header className="projects-explorer-header">
        <div><p className="projects-eyebrow">PORTFOLIO / FILE INDEX</p><h2>Project Explorer</h2><p>Selected builds, grouped for discovery.</p></div>
        <span className="projects-count">{filtered.length}<small> / {projects.length}</small></span>
      </header>
      <label className="projects-search"><Search size={16} aria-hidden="true" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search projects or technologies" aria-label="Search projects or technologies" /></label>
      <div className="projects-categories" role="group" aria-label="Filter projects by category">
        {categories.map((item) => <button type="button" key={item} className={category === item ? "active" : ""} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>)}
      </div>
      {featured.length > 0 && <section className="projects-group"><h3><span>01</span> Featured work</h3><div className="projects-list">{featured.map(renderTile)}</div></section>}
      {other.length > 0 && <section className="projects-group"><h3><span>{featured.length ? "02" : "01"}</span> More projects</h3><div className="projects-list">{other.map(renderTile)}</div></section>}
      {filtered.length === 0 && <p className="projects-empty">No projects match this filter. Try a broader search.</p>}
    </main>
  );
}
