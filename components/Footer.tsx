'use client';

import { useEffect, useState } from 'react';

const LINKEDIN_URL = "https://www.linkedin.com/in/mayur-ahirrao/";
const GITHUB_URL = "https://github.com/mayurpatil2708";

export default function Footer() {
  const [year, setYear] = useState<number>(new Date().getFullYear());

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer>
      <div className="footer-content">
        <div className="footer-year">&copy; {year}</div>
        <div className="footer-links">
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            title="LinkedIn"
          >
            <i className="fab fa-linkedin"></i>
          </a>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            title="GitHub"
          >
            <i className="fab fa-github"></i>
          </a>
        </div>
        <div className="footer-credit">Built by Mayur</div>
      </div>
    </footer>
  );
}
