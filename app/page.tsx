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
              I'm Mayur — a Traffic Systems Design Engineer at WSP, focused on
              signal design, intelligent transportation systems (ITS), and
              street lighting circuit engineering. I like taking a corridor
              from a concept plan to a fully detailed, field-ready design —
              signal timing, conduit runs, wire sizing, and everything in
              between.
            </p>
            <p>
              Most of my day-to-day work involves signal plan development,
              circuit and voltage drop analysis, and coordinating with
              utilities, jurisdictions, and construction teams to make sure
              designs hold up once they leave the drawing board. I also build
              my own tools when the ones available don't quite fit the job —
              that's how Circuit Line came to be.
            </p>
          </div>
          <Portrait className="mobile-image" />
        </div>

        {/* Second section: Intro para 3-4 */}
        <div className="intro-section">
          <div className="intro">
            <p>
              I care about designs that actually work in the field, not just
              on paper — that means thinking through constructability, code
              compliance, and long-term maintenance from the start, not as an
              afterthought.
            </p>
            <p>
              Outside of work, I like digging into the technical edge cases
              other people skip over, which is usually where side projects
              like Circuit Line come from. Always happy to talk shop about
              signal design, ITS, or anything electrical on the traffic side —
              let's connect!
            </p>
          </div>
        </div>

        {/* Desktop layout: Intro + Image side by side */}
        <div className="desktop-layout">
          <div className="intro">
            <h2>Hey there!</h2>
            <p>
              I'm Mayur — a Traffic Systems Design Engineer at WSP, focused on
              signal design, intelligent transportation systems (ITS), and
              street lighting circuit engineering. I like taking a corridor
              from a concept plan to a fully detailed, field-ready design —
              signal timing, conduit runs, wire sizing, and everything in
              between.
            </p>
            <p>
              Most of my day-to-day work involves signal plan development,
              circuit and voltage drop analysis, and coordinating with
              utilities, jurisdictions, and construction teams to make sure
              designs hold up once they leave the drawing board. I also build
              my own tools when the ones available don't quite fit the job —
              that's how Circuit Line came to be.
            </p>
            <p>
              I care about designs that actually work in the field, not just
              on paper — that means thinking through constructability, code
              compliance, and long-term maintenance from the start, not as an
              afterthought.
            </p>
            <p>
              Outside of work, I like digging into the technical edge cases
              other people skip over, which is usually where side projects
              like Circuit Line come from. Always happy to talk shop about
              signal design, ITS, or anything electrical on the traffic
              side — let's connect!
            </p>
          </div>
          <Portrait />
        </div>
      </div>
    </main>
  );
}
