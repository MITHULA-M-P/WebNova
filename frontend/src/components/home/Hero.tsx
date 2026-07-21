import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getWebsiteSettings, getPublicStatistics, type WebsiteSettings, type StatisticItem } from "../../services/api";
import "../../css/Hero.css";

function Hero() {
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);
  const [stats, setStats] = useState<StatisticItem[]>([]);

  useEffect(() => {
    getWebsiteSettings().then(setSettings).catch(console.error);
    getPublicStatistics().then(setStats).catch(console.error);
  }, []);

  return (
    <section className="hero">
      {/* Background blobs */}
      <div className="hero-blob hero-blob-1" />
      <div className="hero-blob hero-blob-2" />

      <div className="container hero-inner">

        {/* Left: Copy */}
        <div className="hero-content">
          <span className="hero-pill">🚀 Custom Websites for Every Business</span>

          <h1 className="hero-heading">
            {settings?.hero_title || (
              <>Launch a <span>Professional Website</span> Without Technical Stress</>
            )}
          </h1>

          <p className="hero-desc">
            {settings?.hero_subtitle || "We design fast, mobile-friendly, SEO-optimized websites tailored exactly to your business."}
          </p>

          <div className="hero-actions">
            <Link to="/planner" className="btn btn-primary btn-lg">
              Plan My Website →
            </Link>
            <Link to="/templates" className="btn btn-secondary btn-lg">
              Browse Templates
            </Link>
          </div>

          <div className="hero-stats">
            {stats.length > 0 ? (
              stats.slice(0, 3).map((st, idx) => (
                <div key={st.id} style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  {idx > 0 && <div className="hero-stat-divider" />}
                  <div className="hero-stat">
                    <strong>{st.prefix || ""}{st.value}{st.suffix || ""}</strong>
                    <span>{st.label}</span>
                  </div>
                </div>
              ))
            ) : (
              <>
                <div className="hero-stat">
                  <strong>150+</strong>
                  <span>Projects Delivered</span>
                </div>
                <div className="hero-stat-divider" />
                <div className="hero-stat">
                  <strong>4.9★</strong>
                  <span>Average Rating</span>
                </div>
                <div className="hero-stat-divider" />
                <div className="hero-stat">
                  <strong>5 Days</strong>
                  <span>Avg. Delivery</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right: Mockup Card */}
        <div className="hero-visual">
          <div className="hero-card">

            <div className="hcard-topbar">
              <div className="hcard-dots">
                <span /><span /><span />
              </div>
              <div className="hcard-url">webnova.in</div>
            </div>

            <div className="hcard-body">
              <div className="hcard-label">🎯 Your Website Blueprint</div>
              <h3 className="hcard-title">Business Website</h3>

              <div className="hcard-features">
                {["5 Custom Pages", "WhatsApp Chat Widget", "Online Booking System", "Google SEO Setup", "Mobile Responsive"].map((f) => (
                  <div className="hcard-feature" key={f}>
                    <span className="hcard-check">✓</span>
                    {f}
                  </div>
                ))}
              </div>

              <div className="hcard-price">
                <span>Estimated Cost</span>
                <strong>₹18,500</strong>
              </div>

              <Link to="/planner" className="hcard-btn">Start Building →</Link>
            </div>

          </div>

          <div className="hero-float hero-float-1">⚡ 4-7 Days Delivery</div>
          <div className="hero-float hero-float-2">🔒 100% Transparent Pricing</div>
        </div>

      </div>
    </section>
  );
}

export default Hero;