import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import "../../css/Navbar.css";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/templates", label: "Templates" },
  { to: "/pricing", label: "Estimator" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/reviews", label: "Reviews" },
  { to: "/planner", label: "Planner" },
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
      <div className="navbar-inner container">

        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <span className="logo-icon">✦</span>
          <span className="logo-text">Web<span>Nova</span></span>
        </Link>

        <nav className={`navbar-nav ${menuOpen ? "nav-open" : ""}`}>
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                `nav-link ${isActive ? "nav-link-active" : ""}`
              }
              onClick={closeMenu}
            >
              {link.label}
            </NavLink>
          ))}
          <button
            type="button"
            className="theme-toggle-btn"
            onClick={toggleTheme}
            title={`Switch to ${theme === "light" ? "Dark" : "Light"} mode`}
            style={{
              padding: "8px 12px",
              borderRadius: "8px",
              background: "var(--surface-hover, rgba(0,0,0,0.05))",
              border: "1px solid var(--border)",
              color: "var(--text)",
              cursor: "pointer",
              fontSize: "14px",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              marginRight: "8px",
            }}
          >
            <span>{theme === "light" ? "🌙" : "☀️"}</span>
            <span>{theme === "light" ? "Dark" : "Light"}</span>
          </button>

          <Link to="/book-call" className="nav-cta btn btn-primary" onClick={closeMenu}>
            Book a Call
          </Link>
        </nav>

        <button
          className={`hamburger ${menuOpen ? "hamburger-open" : ""}`}
          aria-label="Toggle navigation menu"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

      </div>

      {menuOpen && (
        <div className="nav-backdrop" onClick={closeMenu} />
      )}
    </header>
  );
}

export default Navbar;