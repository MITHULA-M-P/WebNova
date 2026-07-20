import { useLocation, useNavigate } from "react-router-dom";
import "../css/Blueprint.css";

function Blueprint() {
  const location = useLocation();
  const navigate = useNavigate();

  const data = location.state as any;

  if (!data) {
    return (
      <section className="blueprint-section">
        <div className="blueprint-container">
          <h1>No Blueprint Found</h1>
          <p>Please complete the planner first.</p>

          <button
            className="blueprint-btn"
            onClick={() => navigate("/planner")}
          >
            Go to Planner
          </button>
        </div>
      </section>
    );
  }

  // Handle both React state shape & database response shape
  const websiteType = data.website_type || data.websiteType || "Custom Website";
  const businessGoal = data.business_goal || data.businessGoal || "N/A";
  const businessName = data.customer?.business_name || data.businessName || "Your Business";
  const email = data.customer?.email || data.email || "N/A";
  const phone = data.customer?.phone || data.phone || "N/A";
  const budget = data.budget || 10000;
  const pages = data.pages || 5;
  const hasLogo = data.has_logo !== undefined ? data.has_logo : data.hasLogo;
  const brandColor = data.brand_color || data.brandColor || "Not Selected";

  // Parse features array
  const featuresList: string[] = Array.isArray(data.features)
    ? data.features.map((f: any) => (typeof f === "string" ? f : f.feature_name))
    : [];

  const recommendedPages = [
    "Home",
    "About",
    "Services",
    "Gallery",
    "Contact",
  ];

  if (websiteType === "Restaurant") {
    recommendedPages.splice(2, 1, "Menu");
  }

  if (websiteType === "Portfolio") {
    recommendedPages.splice(1, 2, "Projects", "Skills");
  }

  if (websiteType === "E-Commerce") {
    recommendedPages.splice(2, 2, "Products", "Cart");
  }

  return (
    <section className="blueprint-section page-content">
      <div className="blueprint-container">
        <h1>Your Website Blueprint</h1>

        <div className="blueprint-card">
          <h2>{websiteType} Website</h2>

          <p>
            Personalized website recommendation based on your requirements.
          </p>

          <div className="blueprint-grid">
            <div>
              <h3>Business Goal</h3>
              <p>{businessGoal}</p>

              <h3>Recommended Pages</h3>
              <ul>
                {recommendedPages.map((page) => (
                  <li key={page}>✔ {page}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3>Selected Features</h3>
              <ul>
                {featuresList.length > 0 ? (
                  featuresList.map((feature) => (
                    <li key={feature}>✔ {feature}</li>
                  ))
                ) : (
                  <li>No Features Selected</li>
                )}
              </ul>
            </div>
          </div>

          <div className="summary">
            <h3>Business Name</h3>
            <p>{businessName}</p>

            <h3>Estimated Budget</h3>
            <h2>₹{budget.toLocaleString("en-IN")}</h2>

            <h3>Estimated Pages</h3>
            <p>{pages}</p>
          </div>

          <div className="summary">
            <h3>Contact Information</h3>
            <p>
              <strong>Email:</strong> {email}
            </p>
            <p>
              <strong>Phone:</strong> {phone}
            </p>
            <p>
              <strong>Logo Available:</strong> {hasLogo ? "Yes" : "No"}
            </p>
            <p>
              <strong>Brand Color:</strong> {brandColor}
            </p>
          </div>

          <button
            className="blueprint-btn"
            onClick={() => navigate("/book-call", { state: { email, phone, name: businessName } })}
          >
            Book Discovery Call
          </button>
        </div>
      </div>
    </section>
  );
}

export default Blueprint;