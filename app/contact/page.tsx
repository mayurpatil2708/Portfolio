import Hero from "@/components/Hero";
import ContactForm from "@/components/ContactForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact - Mayur Patil",
  description: "Get in touch with Mayur Patil, Traffic Systems Design Engineer at WSP.",
};

const LINKEDIN_URL = "https://www.linkedin.com/in/mayur-ahirrao/";
const GITHUB_URL = "https://github.com/mayurpatil2708";
const MAP_EMBED_URL =
  "https://www.google.com/maps?q=Tempe,AZ&output=embed";

export default function Contact() {
  return (
    <main>
      <Hero
        title="Contact"
        subtitle="Always happy to talk shop about signal design, ITS, or anything electrical on the traffic side."
      />
      <section className="page-section">
        <div className="contact-grid">
          <div className="contact-map">
            <iframe
              src={MAP_EMBED_URL}
              title="Map location - Tempe, AZ"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div className="contact-form-panel">
            <h2>Send a Message</h2>
            <ContactForm />
            <div className="contact-links">
              <a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-link"
              >
                <i className="fab fa-linkedin"></i> LinkedIn
              </a>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-link"
              >
                <i className="fab fa-github"></i> GitHub
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
