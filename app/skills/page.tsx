import Hero from "@/components/Hero";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Skills - Mayur Patil",
  description: "Technical skills and expertise in traffic signal design, ITS, and circuit engineering.",
};

const skills = [
  {
    title: "Signal & Roadway Design",
    items: ["Signal Timing", "Signal Plan Development", "Intersection Design", "MUTCD", "Geometric Design"],
  },
  {
    title: "Design & Drafting Software",
    items: ["AutoCAD", "MicroStation", "Civil 3D", "OpenRoads"],
  },
  {
    title: "Traffic Analysis & Modeling",
    items: ["Synchro", "VISSIM", "SimTraffic", "HCS"],
  },
  {
    title: "Intelligent Transportation Systems",
    items: ["ITS Design", "CCTV & Detection Systems", "Fiber/Communications Plans", "Signal Controllers"],
  },
  {
    title: "Electrical & Circuit Design",
    items: ["Voltage Drop Analysis", "NEC Electrical Code", "Street Lighting Circuits", "Load Calculations"],
  },
  {
    title: "GIS & Data Tools",
    items: ["ArcGIS", "Excel", "Python (scripting/automation)"],
  },
  {
    title: "Standards & Coordination",
    items: ["DOT Standards & Specs", "Utility Coordination", "Construction Support", "QA/QC"],
  },
];

export default function Skills() {
  return (
    <main>
      <Hero title="Skills & Technologies" subtitle="An overview of the design tools, analysis software, and standards I work with day-to-day." />
      <section className="page-section">
        <div className="skills-tiles">
          {skills.map((skillGroup, index) => (
            <div key={skillGroup.title} className={`skill-tile ${index === skills.length - 1 ? 'tools-tile' : ''}`}>
              <h3>{skillGroup.title}</h3>
              <div className="skill-tags">
                {skillGroup.items.map((item) => (
                  <span key={item} className="skill-tag">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
