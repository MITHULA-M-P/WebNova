import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { Template } from "../data/templates";
import TemplateCard from "../components/templates/TemplateCard";
import BrowserPreview from "../components/templates/BrowserPreview";
import { getTemplates } from "../services/api";
import "../css/Templates.css";

function Templates() {
  const navigate = useNavigate();
  const [templatesList, setTemplatesList] = useState<Template[]>([]);
  const [selected, setSelected] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getTemplates()
      .then((data) => {
        setTemplatesList(data);
        if (data.length > 0) {
          setSelected(data[0]); // default select first template
        }
      })
      .catch((err) => {
        console.error(err);
        setError("Could not load website templates. Please try again.");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleStartPlanning = (template: Template) => {
    // Parse features to clean match with planner steps
    const mappedFeatures = template.features.map(f => {
      if (f.toLowerCase().includes("contact")) return "Contact Form";
      if (f.toLowerCase().includes("whatsapp")) return "WhatsApp Chat";
      if (f.toLowerCase().includes("booking") || f.toLowerCase().includes("reservation")) return "Online Booking";
      if (f.toLowerCase().includes("blog") || f.toLowerCase().includes("article")) return "Blog";
      if (f.toLowerCase().includes("payment") || f.toLowerCase().includes("checkout")) return "Payment Gateway";
      if (f.toLowerCase().includes("gallery") || f.toLowerCase().includes("portfolio")) return "Gallery";
      return f;
    }).filter(f => ["Contact Form", "WhatsApp Chat", "Online Booking", "Blog", "Payment Gateway", "Gallery"].includes(f));

    // Convert price like "₹9,999" to number
    const numericBudget = parseInt(template.price.replace(/[^0-9]/g, "")) || 10000;

    navigate("/planner", {
      state: {
        websiteType: template.name,
        pages: template.pages.length,
        features: mappedFeatures,
        budget: numericBudget
      }
    });
  };

  return (
    <div className="templates-page page-content">
      {/* Hero */}
      <section className="templates-hero">
        <div className="container text-center">
          <span className="section-label">Templates</span>
          <h1 className="section-title">
            Choose Your Website <span>Style</span>
          </h1>
          <p className="section-subtitle">
            Select a base template design. You can fully customize pages, features, and configurations in the next step.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="section" style={{ minHeight: "300px" }}>
        <div className="container">
          {loading && (
            <div className="text-center" style={{ padding: "40px" }}>
              <p>Loading premium designs...</p>
            </div>
          )}

          {error && (
            <div className="text-center" style={{ padding: "40px", color: "red" }}>
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && (
            <>
              <div className="templates-grid">
                {templatesList.map((template) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    onSelect={setSelected}
                  />
                ))}
              </div>

              {/* Detailed Selected Template Panel */}
              {selected && (
                <div className="template-details-card">
                  <div className="details-grid">
                    {/* Details Left */}
                    <div className="details-content">
                      <h2>
                        <span>{selected.icon}</span> {selected.name}
                      </h2>
                      <p className="desc">{selected.description}</p>

                      <div className="details-meta-lists">
                        <div className="meta-column">
                          <h3>Recommended Pages</h3>
                          <ul>
                            {selected.pages.map((page) => (
                              <li key={page}>{page}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="meta-column">
                          <h3>Included Features</h3>
                          <ul>
                            {selected.features.map((feature) => (
                              <li key={feature}>{feature}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="pricing-info">
                        <div className="price-box">
                          <span>Estimated Price</span>
                          <strong>{selected.price}</strong>
                        </div>
                        <div className="delivery-box">
                          <span>Delivery Timeline</span>
                          <p>{selected.delivery}</p>
                        </div>
                      </div>

                      <button
                        className="btn btn-primary w-full"
                        onClick={() => handleStartPlanning(selected)}
                      >
                        Start With This Template →
                      </button>
                    </div>

                    {/* Details Right (Browser Mockup Preview) */}
                    <div className="details-preview">
                      <BrowserPreview template={selected} />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}

export default Templates;