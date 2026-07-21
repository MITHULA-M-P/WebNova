import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getWebsiteSettings, type WebsiteSettings } from "../../services/api";
import "../../css/Footer.css";

function Footer() {
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);

  useEffect(() => {
    getWebsiteSettings().then(setSettings).catch(console.error);
  }, []);

  const year = new Date().getFullYear();
  const companyName = settings?.company_name || "WebNova";
  const contactEmail = settings?.contact_email || "hello@webnova.in";
  const phone = settings?.phone_number || "+91 98765 43210";
  const address = settings?.office_address || "Mumbai, Maharashtra, India";
  const footerText = settings?.footer_text || `© ${year} ${companyName}. All Rights Reserved.`;

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
              {settings?.social_instagram && (
                <a href={settings.social_instagram} className="social-icon" aria-label="Instagram" target="_blank" rel="noopener noreferrer">📸</a>
              )}
              {settings?.social_twitter && (
                <a href={settings.social_twitter} className="social-icon" aria-label="Twitter" target="_blank" rel="noopener noreferrer">🐦</a>
              )}
              {settings?.social_linkedin && (
                <a href={settings.social_linkedin} className="social-icon" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">💼</a>
              )}
              {settings?.social_github && (
                <a href={settings.social_github} className="social-icon" aria-label="GitHub" target="_blank" rel="noopener noreferrer">🐙</a>
              )}
              {/* Show default socials if no settings loaded yet */}
              {!settings && (
                <>
                  <a href="#instagram" className="social-icon" aria-label="Instagram">📸</a>
                  <a href="#twitter" className="social-icon" aria-label="Twitter">🐦</a>
                  <a href="#linkedin" className="social-icon" aria-label="LinkedIn">💼</a>
                  <a href="#whatsapp" className="social-icon" aria-label="WhatsApp">💬</a>
                </>
              )}
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
                <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
              </li>
              <li>
                <span className="contact-icon">📱</span>
                <a href={`tel:${phone.replace(/\s/g, "")}`}>{phone}</a>
              </li>
              <li>
                <span className="contact-icon">📍</span>
                <span>{address}</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="footer-bottom">
          <p>{footerText.includes(year.toString()) ? footerText : `${footerText}`}</p>
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