import Hero from "@/components/Hero";

export default function Tools() {
  return (
    <main>
      <Hero
        title="Tools"
        subtitle="Circuit Line — an interactive street lighting voltage drop calculator I built to model circuit layouts, wire sizing, and NEC compliance across full pole runs."
      />
      <section className="page-section" style={{ paddingTop: "1.5rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem",
            flexWrap: "wrap",
            gap: "0.75rem",
          }}
        >
          <div>
            <h2 style={{ margin: 0 }}>Circuit Line</h2>
            <p
              style={{
                margin: "0.25rem 0 0",
                color: "var(--text-secondary)",
                fontSize: "0.95rem",
              }}
            >
              Model source-to-pole circuit runs, assign wire gauges per
              segment, and check voltage drop against your threshold.
              Save/load layouts as JSON.
            </p>
          </div>
          <a
            href="/tools/circuit-line.html"
            target="_blank"
            rel="noopener noreferrer"
            className="hero-btn hero-btn-primary"
            style={{ whiteSpace: "nowrap" }}
          >
            Open in new tab ↗
          </a>
        </div>

        <div
          style={{
            border: "1px solid var(--border-color)",
            borderRadius: "var(--radius-card)",
            overflow: "hidden",
            boxShadow: "var(--shadow-hover)",
            height: "80vh",
            minHeight: "600px",
          }}
        >
          <iframe
            src="/tools/circuit-line.html"
            title="Circuit Line - Voltage Drop Tool"
            style={{ width: "100%", height: "100%", border: 0 }}
            loading="lazy"
          />
        </div>
      </section>
    </main>
  );
}
