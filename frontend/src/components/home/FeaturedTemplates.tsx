import { Link } from "react-router-dom";
import "../../css/FeaturedTemplates.css";

const templates = [
  { title: "Business", emoji: "🏢", desc: "Corporate & professional websites for companies.", price: "₹12,000+" },
  { title: "Restaurant", emoji: "🍽️", desc: "Showcase your menu and take reservations online.", price: "₹15,000+" },
  { title: "Portfolio", emoji: "🎨", desc: "Beautifully display your work and attract clients.", price: "₹10,000+" },
  { title: "E-Commerce", emoji: "🛒", desc: "Sell products with secure online payment gateways.", price: "₹25,000+" },
  { title: "Educational Institute", emoji: "🏫", desc: "Publish courses, accept admissions, manage events.", price: "₹18,000+" },
  { title: "Startup", emoji: "🚀", desc: "SaaS landing page with pricing, features & waitlist.", price: "₹14,000+" },
];

function FeaturedTemplates() {
  return (
    <section className="feat-section">
      <div className="container">
        <div className="text-center feat-header">
          <span className="section-label">Templates</span>
          <h2 className="section-title">Website <span>Templates</span></h2>
          <p className="section-subtitle">Six fully customisable layouts — built to suit every business type and industry.</p>
        </div>

        <div className="feat-grid">
          {templates.map((t) => (
            <div className="feat-card" key={t.title}>
              <div className="feat-icon">{t.emoji}</div>
              <h3>{t.title}</h3>
              <p>{t.desc}</p>
              <div className="feat-price">{t.price}</div>
              <Link to="/templates" className="feat-link">View Template →</Link>
            </div>
          ))}
        </div>

        <div className="text-center" style={{ marginTop: "48px" }}>
          <Link to="/templates" className="btn btn-primary">Explore All Templates</Link>
        </div>
      </div>
    </section>
  );
}

export default FeaturedTemplates;