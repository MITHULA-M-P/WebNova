import { useState, useEffect } from "react";
import { getPortfolio } from "../services/api";
import type { Project } from "../types/portfolio";
import "../css/Portfolio.css";

const categories = [
  "All",
  "Web Application",
  "Dashboard",
  "E-Commerce",
  "Business",
  "Startup",
];

function Portfolio() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPortfolio()
      .then((data) => {
        setProjects(data);
      })
      .catch((err) => console.error("Error loading portfolio:", err))
      .finally(() => setLoading(false));
  }, []);

  const filteredProjects =
    selectedCategory === "All"
      ? projects
      : projects.filter((project) => project.category === selectedCategory);

  return (
    <div className="portfolio-page page-content">
      {/* Header */}
      <section className="portfolio-hero section">
        <div className="container text-center">
          <span className="section-label">Our Work</span>
          <h1 className="section-title">
            Projects We're Proud <span>Of</span>
          </h1>
          <p className="section-subtitle">
            Explore our curated gallery of high-performing custom-built
            websites crafted to delight clients and drive growth.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="portfolio-filters-section">
        <div className="container flex-center">
          <div className="filters-container">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`filter-btn ${selectedCategory === cat ? "active" : ""}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="portfolio-grid-section section">
        <div className="container">
          {loading ? (
            <div style={{ textAlign: "center", padding: "40px", color: "var(--muted)" }}>
              Loading portfolio projects…
            </div>
          ) : (
            <div className="portfolio-grid">
              {filteredProjects.map((project) => (
                <div key={project.id} className="project-card">
                  <div className="project-image">
                    <img
                      src={project.imageUrl || (project as any).image}
                      alt={project.name || (project as any).title}
                      className="project-img"
                    />
                  </div>

                  <div className="project-details">
                    <span className="project-category">
                      {project.category}
                    </span>

                    <h3 className="project-name">{project.name || (project as any).title}</h3>

                    <p className="project-desc">
                      {project.description}
                    </p>

                    <div className="project-tech-stack">
                      {Array.isArray(project.technologies)
                        ? project.technologies.map((tech) => (
                            <span key={tech} className="tech-badge">
                              {tech}
                            </span>
                          ))
                        : String(project.technologies).split(",").map((t) => (
                            <span key={t} className="tech-badge">
                              {t.trim()}
                            </span>
                          ))}
                    </div>

                    <div className="project-actions">
                      <a
                        href={project.liveUrl || (project as any).demoUrl || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-secondary btn-sm w-full"
                      >
                        Live Demo →
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="portfolio-cta-section text-center section">
        <div className="container">
          <div className="portfolio-cta-inner">
            <h2>Ready to Start Your Website?</h2>
            <p>
              Tell us your requirements, choose a design, and let's craft an
              awesome website for your brand.
            </p>

            <div className="portfolio-cta-actions">
              <a href="/planner" className="btn btn-primary">
                Plan My Website
              </a>

              <a href="/book-call" className="btn btn-secondary">
                Book Discovery Call
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Portfolio;