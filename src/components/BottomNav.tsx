import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: "🏠", ariaLabel: "Go to Dashboard" },
  { to: "/courses", label: "Courses", icon: "📚", ariaLabel: "View all courses" },
  { to: "/assignments", label: "Tasks", icon: "📝", ariaLabel: "View assignments" }
];

export const BottomNav = () => {
  return (
    <nav className="bottom-nav" role="navigation" aria-label="Mobile navigation">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) => `bottom-nav-item${isActive ? " active" : ""}`}
          end={item.to === "/dashboard"}
          aria-label={item.ariaLabel}
        >
          <span className="bottom-nav-icon" aria-hidden="true">{item.icon}</span>
          <span className="bottom-nav-label">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
};
