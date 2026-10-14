"use client";

import React, { useMemo, useState } from "react";
import { BrainCircuit, Braces, Code2, Database, Search, Server, Wrench } from "lucide-react";
import { skills } from "@/data/skills";

const MODULE_ICONS = [Braces, Code2, BrainCircuit, Database, Wrench];
const MODULE_NOTES: Record<string, string> = {
  "Languages & Data": "Core programming and data foundations",
  "Web Development": "Interfaces and application APIs",
  "AI & Agent Systems": "Retrieval, reasoning workflows, and tool use",
  "Backend & Data Access": "Service layers and managed data platforms",
  "Project Technologies": "Tools used in featured project implementations",
  "Tools & Collaboration": "Version control and delivery workflow",
};

export default function SkillsApp() {
  const [query, setQuery] = useState("");
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const normalizedQuery = query.trim().toLowerCase();
  const modules = useMemo(() => skills.map((category) => ({
    ...category,
    skills: category.skills.filter((skill) => !normalizedQuery || skill.name.toLowerCase().includes(normalizedQuery)),
  })).filter((category) => category.skills.length > 0), [normalizedQuery]);
  const skillCount = skills.reduce((total, category) => total + category.skills.length, 0);

  return (
    <main className="skills-system">
      <header className="skills-system-header">
        <div className="skills-core" aria-hidden="true">
          <div className="skills-core-orbit" />
          <BrainCircuit size={28} strokeWidth={1.7} />
        </div>
        <div className="skills-system-intro">
          <p className="skills-eyebrow">SYSTEM / CAPABILITIES</p>
          <h2>Technical modules</h2>
          <p>Skills drawn from the resume and verified project work. No proficiency scores are implied.</p>
        </div>
        <div className="skills-count"><strong>{skillCount}</strong><span>listed skills</span></div>
      </header>

      <label className="skills-search">
        <Search size={16} aria-hidden="true" />
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find a skill" aria-label="Find a skill" />
        <span>FILTER</span>
      </label>

      <section className="skills-module-grid" aria-label="Skill categories">
        {modules.map((category, index) => {
          const Icon = MODULE_ICONS[index % MODULE_ICONS.length] ?? Server;
          return (
            <article className="skills-module" key={category.title}>
              <header className="skills-module-title">
                <span className="skills-module-icon"><Icon size={17} aria-hidden="true" /></span>
                <div><h3>{category.title}</h3><p>{MODULE_NOTES[category.title]}</p></div>
                <span className="skills-module-index">{String(index + 1).padStart(2, "0")}</span>
              </header>
              <div className="skills-module-items">
                {category.skills.map((skill) => (
                  <button
                    type="button"
                    key={skill.name}
                    className={`skills-chip${selectedSkill === skill.name ? " selected" : ""}`}
                    aria-pressed={selectedSkill === skill.name}
                    onClick={() => setSelectedSkill(selectedSkill === skill.name ? null : skill.name)}
                  >
                    {skill.name}
                  </button>
                ))}
              </div>
            </article>
          );
        })}
      </section>
      {modules.length === 0 && <p className="skills-empty">No matching skill. Try another search.</p>}
      <footer className="skills-system-footer">
        <span><i /> MODULES ONLINE</span>
        <span>{selectedSkill ? `SELECTED · ${selectedSkill}` : "SELECT A MODULE TO INSPECT"}</span>
      </footer>
    </main>
  );
}
