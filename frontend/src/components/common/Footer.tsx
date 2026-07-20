import { Link } from "react-router-dom";
import "../../css/Footer.css";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">

          {/* Brand Column */}
          <div className="footer-brand">
            <div className="footer-logo">
              <span className="footer-logo-icon">✦</span>
              <span>Web<strong>Nova</strong></span>
            </div>
            <p className="footer-tagline">
              Customer-centric custom websites built for every business — fast, affordable, and beautiful.
            </p>
            <div className="footer-socials">
              <a href="#instagram" className="social-icon" aria-label="Instagram">📸</a>
              <a href="#twitter" className="social-icon" aria-label="Twitter">🐦</a>
              <a href="#linkedin" className="social-icon" aria-label="LinkedIn">💼</a>
              <a href="#whatsapp" className="social-icon" aria-label="WhatsApp">💬</a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/templates">Templates</Link></li>
              <li><Link to="/portfolio">Portfolio</Link></li>
              <li><Link to="/reviews">Reviews</Link></li>
              <li><Link to="/book-call">Book a Call</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div className="footer-col">
            <h4>Services</h4>
            <ul>
              <li><span>Business Websites</span></li>
              <li><span>E-Commerce Stores</span></li>
              <li><span>Portfolio Sites</span></li>
              <li><span>Restaurant Websites</span></li>
              <li><span>Startup Landing Pages</span></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-col">
            <h4>Contact Us</h4>
            <ul className="footer-contact">
              <li>
                <span className="contact-icon">📧</span>
                <a href="mailto:hello@webnova.in">hello@webnova.in</a>
              </li>
              <li>
                <span className="contact-icon">📱</span>
                <a href="tel:+919876543210">+91 98765 43210</a>
              </li>
              <li>
                <span className="contact-icon">📍</span>
                <span>Mumbai, Maharashtra, India</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="footer-bottom">
          <p>© {year} WebNova. All Rights Reserved.</p>
          <div className="footer-bottom-links">
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;