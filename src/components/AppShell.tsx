import { NavLink } from "react-router-dom";
import { ReactNode } from "react";
import { BottomNav } from "./BottomNav";

const navLinks = [
  { to: "/", label: "Dashboard", ariaLabel: "Go to Dashboard" },
  { to: "/courses", label: "Courses", ariaLabel: "View all courses" },
  { to: "/assignments", label: "Assignments", ariaLabel: "View assignments" }
];

export const AppShell = ({ children }: { children: ReactNode }) => {
  return (
    <div className="app-shell">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      
      <header className="topbar" role="banner">
        <div className="brand">
          <div className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 4h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2z" stroke="currentColor" strokeWidth="2"/>
              <text x="12" y="16" fontSize="10" fontWeight="bold" textAnchor="middle" fill="currentColor">PS</text>
            </svg>
          </div>
          <span className="brand-name">PocketSchool</span>
        </div>
        <nav className="nav-links" role="navigation" aria-label="Main navigation">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
              end={link.to === "/"}
              aria-label={link.ariaLabel}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </header>
      
      <main id="main-content" className="content" role="main">
        {children}
      </main>
      
      <BottomNav />
    </div>
  );
};
