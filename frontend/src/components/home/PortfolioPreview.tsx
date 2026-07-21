import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPortfolio } from "../../services/api";
import type { Project } from "../../types/portfolio";
import "../../css/PortfolioPreview.css";

const fallbackProjects = [
  { category: "Restaurant", emoji: "🍽️", title: "Spice Garden", desc: "Elegant website with digital menu, table reservations, and WhatsApp ordering.", color: "#f97316" },
  { category: "Portfolio", emoji: "🎨", title: "Creative Studio", desc: "Minimalist portfolio with interactive project gallery and animations.", color: "#8b5cf6" },
  { category: "Business", emoji: "💼", title: "Apex Consulting", desc: "Professional corporate site with team pages, case studies & contact.", color: "#2563eb" },
  { category: "E-Commerce", emoji: "🛒", title: "Aura Store", desc: "Full e-commerce platform with Razorpay payment and inventory management.", color: "#10b981" },
];

function PortfolioPreview() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPortfolio()
      .then((data) => {
        setProjects(data);
      })
      .catch((err) => console.error("Error loading portfolio preview:", err))
      .finally(() => setLoading(false));
  }, []);

  // Use top 4 projects from API, or fallbacks if API returned empty
  const displayProjects = projects.length > 0 ? projects.slice(0, 4) : [];

  // Helper to assign a color based on category or title
  const getProjectTheme = (idx: number) => {
    const colors = ["#f97316", "#8b5cf6", "#2563eb", "#10b981"];
    const emojis = ["🚀", "🎨", "💻", "🛒"];
    return {
      color: colors[idx % colors.length],
      emoji: emojis[idx % emojis.length],
    };
  };

  return (
    <section className="pp-section">
      <div className="container">
        <div className="text-center pp-header">
          <span className="section-label">Our Work</span>
          <h2 className="section-title">Recent <span>Projects</span></h2>
          <p className="section-subtitle">A sample of websites we've built for real businesses across India.</p>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px", color: "var(--muted)" }}>
            Loading preview projects…
          </div>
        ) : (
          <div className="pp-grid">
            {displayProjects.length > 0 ? (
              displayProjects.map((p, idx) => {
                const theme = getProjectTheme(idx);
                return (
                  <div className="pp-card" key={p.id}>
                    <div className="pp-mockup" style={{ background: `${theme.color}15` }}>
                      <div className="pp-browser-bar">
                        <div className="pp-dots"><span /><span /><span /></div>
                      </div>
                      <div className="pp-screen-content" style={{ color: theme.color }}>
                        <div className="pp-emoji">{theme.emoji}</div>
                        <div className="pp-lines">
                          <div className="pp-line pp-line-wide" style={{ background: `${theme.color}30` }} />
                          <div className="pp-line" style={{ background: `${theme.color}20` }} />
                          <div className="pp-line pp-line-short" style={{ background: `${theme.color}20` }} />
                        </div>
                      </div>
                    </div>
                    <div className="pp-info">
                      <span className="pp-category" style={{ color: theme.color, background: `${theme.color}15` }}>{p.category}</span>
                      <h3>{p.name || (p as any).title}</h3>
                      <p>{p.description}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              fallbackProjects.map((p) => (
                <div className="pp-card" key={p.title}>
                  <div className="pp-mockup" style={{ background: `${p.color}15` }}>
                    <div className="pp-browser-bar">
                      <div className="pp-dots"><span /><span /><span /></div>
                    </div>
                    <div className="pp-screen-content" style={{ color: p.color }}>
                      <div className="pp-emoji">{p.emoji}</div>
                      <div className="pp-lines">
                        <div className="pp-line pp-line-wide" style={{ background: `${p.color}30` }} />
                        <div className="pp-line" style={{ background: `${p.color}20` }} />
                        <div className="pp-line pp-line-short" style={{ background: `${p.color}20` }} />
                      </div>
                    </div>
                  </div>
                  <div className="pp-info">
                    <span className="pp-category" style={{ color: p.color, background: `${p.color}15` }}>{p.category}</span>
                    <h3>{p.title}</h3>
                    <p>{p.desc}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        <div className="text-center" style={{ marginTop: "48px" }}>
          <Link to="/portfolio" className="btn btn-primary">View Full Portfolio →</Link>
        </div>
      </div>
    </section>
  );
}

export default PortfolioPreview;