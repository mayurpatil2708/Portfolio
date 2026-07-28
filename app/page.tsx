import Hero from "@/components/Hero";
import Portrait from "@/components/Portrait";

export const metadata = {
  title: "Mayur Patil - Traffic Systems Design Engineer",
  description: "Traffic Systems Design Engineer @ WSP | Signal Design | ITS | Street Lighting Circuits",
};

export default function Home() {
  return (
    <main>
      <Hero
        title="Mayur Patil"
        subtitle="Traffic Systems Design Engineer @ WSP | Signal Design, ITS & Street Lighting Circuits"
        showButton={true}
      />
      <div className="body-content">
        {/* First section: Intro para 1-2 */}
        <div className="intro-section">
          <div className="intro">
            <h2>Hey there!</h2>
            <p>
              I&apos;m Mayur, a Traffic and Transportation Engineer focused on
              making roads safer, smarter, and easier to navigate. I enjoy
              turning traffic data into real solutions, improving how
              intersections work, and figuring out what actually makes a
              street function better for the people using it.
            </p>
            <p>
              Originally from India and now building my career in the U.S.,
              I bring an adaptable perspective shaped by working across
              different environments, standards, and challenges. I approach
              every project with curiosity, precision, and a focus on
              solutions that hold up in the real world and not just on
              paper.
            </p>
          </div>
          <Portrait className="mobile-image" />
        </div>

        {/* Second section: Intro para 3-4 */}
        <div className="intro-section">
          <div className="intro">
            <p>
              Most of my work revolves around traffic signal design, roadway
              lighting, signing and pavement markings, and Intelligent
              Transportation Systems. I&apos;m comfortable running photometric
              analysis, building signal and striping plans in Open Roads
              Designer and MicroStation, and designing ITS infrastructure
              including fiber networks, CCTV, DMS, and detection systems.
            </p>
            <p>
              Outside of engineering, you&apos;ll find me exploring new places,
              staying active, and always looking for the next thing to
              learn. Let&apos;s connect!
            </p>
          </div>
        </div>

        {/* Desktop layout: Intro + Image side by side */}
        <div className="desktop-layout">
          <div className="intro">
            <h2>Hey there!</h2>
            <p>
              I&apos;m Mayur, a Traffic and Transportation Engineer focused on
              making roads safer, smarter, and easier to navigate. I enjoy
              turning traffic data into real solutions, improving how
              intersections work, and figuring out what actually makes a
              street function better for the people using it.
            </p>
            <p>
              Originally from India and now building my career in the U.S.,
              I bring an adaptable perspective shaped by working across
              different environments, standards, and challenges. I approach
              every project with curiosity, precision, and a focus on
              solutions that hold up in the real world and not just on
              paper.
            </p>
            <p>
              Most of my work revolves around traffic signal design, roadway
              lighting, signing and pavement markings, and Intelligent
              Transportation Systems. I&apos;m comfortable running photometric
              analysis, building signal and striping plans in Open Roads
              Designer and MicroStation, and designing ITS infrastructure
              including fiber networks, CCTV, DMS, and detection systems.
            </p>
            <p>
              Outside of engineering, you&apos;ll find me exploring new places,
              staying active, and always looking for the next thing to
              learn. Let&apos;s connect!
            </p>
          </div>
          <Portrait />
        </div>
      </div>
    </main>
  );
}
