import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
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