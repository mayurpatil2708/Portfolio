'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Header() {
  const [isDark, setIsDark] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Default to the light (beige) theme unless the user explicitly chose dark
    const saved = localStorage.getItem('theme');
    const shouldBeDark = saved === 'dark';

    setIsDark(shouldBeDark);
    applyTheme(shouldBeDark);
  }, []);

  const applyTheme = (dark: boolean) => {
    if (dark) {
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
      document.body.classList.remove('dark-mode');
    }
  };

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    applyTheme(newDark);
    localStorage.setItem('theme', newDark ? 'dark' : 'light');
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header>
      <div className="title-bar">
        <div className="name">
          <Link href="/">Mayur</Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          <ul>
            <li><Link href="/" className={pathname === '/' ? 'nav-active' : ''}>Home</Link></li>
            <li><Link href="/projects" className={pathname === '/projects' ? 'nav-active' : ''}>Projects</Link></li>
            <li><Link href="/tools" className={pathname === '/tools' ? 'nav-active' : ''}>Tools</Link></li>
            <li><Link href="/skills" className={pathname === '/skills' ? 'nav-active' : ''}>Skills</Link></li>
            <li><Link href="/contact" className={pathname === '/contact' ? 'nav-active' : ''}>Contact</Link></li>
          </ul>
        </nav>

        {/* Right side container - hamburger and theme toggle */}
        <div className="header-right">
          {/* Mobile Menu */}
          <div className="mobile-menu-container">
            <button 
              className="hamburger-menu"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              title="Menu"
              aria-label="Toggle menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
            
            {isMenuOpen && (
              <nav className="mobile-nav">
                <ul>
                  <li><Link href="/" onClick={closeMenu} className={pathname === '/' ? 'nav-active' : ''}>Home</Link></li>
                  <li><Link href="/projects" onClick={closeMenu} className={pathname === '/projects' ? 'nav-active' : ''}>Projects</Link></li>
                  <li><Link href="/tools" onClick={closeMenu} className={pathname === '/tools' ? 'nav-active' : ''}>Tools</Link></li>
                  <li><Link href="/skills" onClick={closeMenu} className={pathname === '/skills' ? 'nav-active' : ''}>Skills</Link></li>
                  <li><Link href="/contact" onClick={closeMenu} className={pathname === '/contact' ? 'nav-active' : ''}>Contact</Link></li>
                </ul>
              </nav>
            )}
          </div>

          <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
            <span className="material-icons">{isDark ? 'light_mode' : 'dark_mode'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
