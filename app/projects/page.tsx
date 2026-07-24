import Hero from "@/components/Hero";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects - Mayur Patil",
  description:
    "Traffic signal design, ITS, and street lighting circuit engineering projects by Mayur Patil.",
};

const projects = [
  {
    title: "Circuit Line",
    description:
      "A self-built street lighting voltage drop calculator and circuit layout tool. Models source-to-pole runs, wire gauge assignment, and NEC compliance checks across full pole runs.",
    tags: ["Voltage Drop", "NEC", "Street Lighting", "Circuit Design"],
    link: "/tools",
    linkLabel: "Open Tool",
  },
];

export default function Projects() {
  return (
    <main>
      <Hero
        title="Projects"
        subtitle="Signal design, ITS, and circuit engineering work — plus the tools I've built along the way."
      />
      <section className="page-section">
        <div className="projects-grid">
          {projects.map((project) => (
            <div key={project.title} className="project-card">
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <div className="skill-tags">
                {project.tags.map((tag) => (
                  <span key={tag} className="skill-tag">
                    {tag}
                  </span>
                ))}
              </div>
              <a href={project.link} className="project-link">
                {project.linkLabel} &rarr;
              </a>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
