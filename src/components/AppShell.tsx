import { NavLink } from "react-router-dom";
import { ReactNode } from "react";

const navLinks = [
  { to: "/", label: "Dashboard" },
  { to: "/courses", label: "Courses" },
  { to: "/assignments", label: "Assignments" }
];

export const AppShell = ({ children }: { children: ReactNode }) => {
  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">M</span>
          <span>Megamind</span>
        </div>
        <nav className="nav-links">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
              end={link.to === "/"}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="content">{children}</main>
    </div>
  );
};
