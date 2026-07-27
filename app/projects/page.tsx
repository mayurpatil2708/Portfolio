import Hero from "@/components/Hero";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects - Mayur Patil",
  description:
    "Traffic signal design, ITS, and roadway lighting projects delivered at WSP and AECOM by Mayur Patil.",
};

interface ExperienceProject {
  name: string;
  client: string;
  role: string;
  summary: string;
}

interface Experience {
  role: string;
  company: string;
  location: string;
  period: string;
  projects: ExperienceProject[];
}

const experience: Experience[] = [
  {
    role: "Associate Traffic Engineer",
    company: "WSP USA",
    location: "Tempe, Arizona",
    period: "January 2025 – Present",
    projects: [
      {
        name: "SR 30 Corridor Lighting Design",
        client: "ADOT, Phoenix Metro, AZ",
        role: "Traffic / Lighting Design Engineer",
        summary:
          "Performed roadway lighting analysis and photometric evaluations in AGi32 for a major freeway corridor, developing lighting layouts and supporting pole and luminaire coordination to improve nighttime visibility and driver safety.",
      },
      {
        name: "I-19 Irvington Road Traffic Interchange",
        client: "ADOT, Tucson, AZ",
        role: "Traffic / ITS Design Support",
        summary:
          "Supported traffic signal, ITS, signing, and pavement marking design for a major interchange improvement, preparing plan sheets and engineering documentation for the construction package.",
      },
      {
        name: "Butler Avenue Complete Streets",
        client: "Flagstaff, AZ",
        role: "Traffic Engineering Support",
        summary:
          "Supported signing, striping, signal coordination, and multimodal improvements focused on pedestrian safety, accessibility, and operational efficiency along a complete-streets corridor.",
      },
      {
        name: "Cactus Road Improvements",
        client: "City of Surprise, AZ",
        role: "Traffic Design Support",
        summary:
          "Developed signing and pavement marking plans in accordance with municipal design standards, supporting corridor safety and operational improvements.",
      },
      {
        name: "City of Glendale ITS Standards Development",
        client: "Glendale, AZ",
        role: "ITS Design Support",
        summary:
          "Assisted in developing municipal ITS design standards and standard details — conduit systems, pull boxes, and communications layouts — to improve constructability and consistency citywide.",
      },
    ],
  },
  {
    role: "Traffic / ITS Engineer",
    company: "AECOM Technical Services Inc.",
    location: "Pittsburgh, Pennsylvania",
    period: "February 2023 – October 2024",
    projects: [
      {
        name: "WSDOT SR-520, I-5 to Montlake Interchange and Bridge Replacement",
        client: "Seattle, WA",
        role: "ITS Engineer",
        summary:
          "Supported ITS infrastructure upgrades — CCTV, fiber optic communications, and traffic management facilities — for a major interchange and bridge replacement, producing staging and AutoCAD design plans.",
      },
      {
        name: "PennDOT I-80 Lighting Analysis and Design",
        client: "Monroe County, PA",
        role: "Traffic Engineer",
        summary:
          "Performed lighting warrant evaluations and roadway illumination analysis in AGi32, developing lighting layouts integrated into OpenRoads Designer construction plans.",
      },
      {
        name: "PennDOT SR-68 Traffic Signal Improvement Project",
        client: "Butler County, PA",
        role: "ITS Engineer",
        summary:
          "Developed traffic signal design plans for nine signalized intersections, including detection and timing improvements, radar detection, GPS clocks, and emergency vehicle pre-emption.",
      },
      {
        name: "DelDOT Brenford Road Lighting Analysis and Design",
        client: "Smyrna, DE",
        role: "ITS Engineer",
        summary:
          "Prepared lighting warrant evaluations and roadway lighting analysis per DelDOT standards, developing construction plans for lighting improvements.",
      },
    ],
  },
  {
    role: "Traffic / Technology / ITS Intern",
    company: "AECOM Technical Services Inc.",
    location: "Phoenix, Arizona",
    period: "June 2022 – December 2022",
    projects: [
      {
        name: "ADOT I-10 Truck Parking Availability System",
        client: "Arizona",
        role: "ITS Engineering Intern",
        summary:
          "Assisted in planning fiber optic communications infrastructure and ITS deployment for a real-time truck parking availability system, including radar, CCTV, and message board design.",
      },
      {
        name: "Valley Metro South Central Light Rail Extension",
        client: "Phoenix, AZ",
        role: "Traffic Engineering Intern",
        summary:
          "Assisted with traffic signal design and infrastructure coordination for a major light rail expansion, supporting design reviews and quality control.",
      },
      {
        name: "SR 101 System Improvements with I-10 DCR and Environmental Document",
        client: "Arizona",
        role: "Traffic Engineering Intern",
        summary:
          "Conducted traffic volume studies and operational analyses using VISSIM and CAD tools, supporting transportation planning and operational evaluations.",
      },
      {
        name: "Tempe Streetcar Signal and Communications",
        client: "City of Tempe, AZ",
        role: "ITS Engineering Intern",
        summary:
          "Supported implementation of traffic signal and communications systems, including D4 controllers and EMTRAC detection technology, for streetcar operations.",
      },
    ],
  },
];

const tools = [
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
        subtitle="Transportation and ITS design work delivered at WSP and AECOM — plus the tools I've built along the way."
      />
      <section className="page-section">
        {experience.map((job) => (
          <div key={`${job.company}-${job.period}`} className="experience-group">
            <div className="experience-header">
              <h2>{job.role}</h2>
              <p>
                {job.company} · {job.location} · {job.period}
              </p>
            </div>
            <div className="projects-grid">
              {job.projects.map((project) => (
                <div key={project.name} className="project-card">
                  <h3>{project.name}</h3>
                  <p className="project-meta">
                    {project.role} · {project.client}
                  </p>
                  <p>{project.summary}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      <section className="page-section" style={{ paddingTop: 0 }}>
        <div className="experience-header">
          <h2>Tools I&apos;ve built</h2>
          <p>Side projects that grew out of the day-to-day work.</p>
        </div>
        <div className="projects-grid">
          {tools.map((project) => (
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
