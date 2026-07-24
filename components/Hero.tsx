import Link from "next/link";

interface HeroProps {
  title: string;
  subtitle: string;
  showButton?: boolean;
}

export default function Hero({ title, subtitle, showButton }: HeroProps) {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>{title}</h1>
        <p>{subtitle}</p>
        {showButton && (
          <div className="hero-actions">
            <Link href="/projects" className="hero-btn hero-btn-primary">
              Explore My Design
            </Link>
            <Link href="/tools" className="hero-btn hero-btn-secondary">
              View My Tools
            </Link>
            <Link href="/contact" className="hero-btn hero-btn-secondary">
              Get In Touch
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
