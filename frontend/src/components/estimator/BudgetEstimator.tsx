import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/EstimatorPreview.css"; // Reuse styling variables

function BudgetEstimator() {
  const navigate = useNavigate();

  const [websiteType, setWebsiteType] = useState("Business");
  const [pages, setPages] = useState(5);
  const [hasBooking, setHasBooking] = useState(false);
  const [hasBlog, setHasBlog] = useState(false);
  const [hasSeo, setHasSeo] = useState(false);
  const [hasPayment, setHasPayment] = useState(false);
  const [hasWhatsapp, setHasWhatsapp] = useState(false);

  const [liveCost, setLiveCost] = useState(10000);

  // Re-calculate cost on options change
  useEffect(() => {
    let base = 8000;
    if (websiteType === "Restaurant") base = 9000;
    if (websiteType === "Portfolio") base = 7000;
    if (websiteType === "E-Commerce") base = 15000;
    if (websiteType === "Educational Institute") base = 10000;
    if (websiteType === "Startup") base = 11000;

    const perPage = 1000;
    const bookingCost = hasBooking ? 3000 : 0;
    const blogCost = hasBlog ? 2000 : 0;
    const seoCost = hasSeo ? 4000 : 0;
    const paymentCost = hasPayment ? 5000 : 0;
    const whatsappCost = hasWhatsapp ? 1000 : 0;

    const total = base + (pages * perPage) + bookingCost + blogCost + seoCost + paymentCost + whatsappCost;
    setLiveCost(total);
  }, [websiteType, pages, hasBooking, hasBlog, hasSeo, hasPayment, hasWhatsapp]);

  const handleContinue = () => {
    // Build selected features array matching steps
    const selectedFeatures: string[] = [];
    if (hasBooking) selectedFeatures.push("Online Booking");
    if (hasBlog) selectedFeatures.push("Blog");
    if (hasSeo) selectedFeatures.push("Gallery"); // mapping to standard planner checklist
    if (hasPayment) selectedFeatures.push("Payment Gateway");
    if (hasWhatsapp) selectedFeatures.push("WhatsApp Chat");

    navigate("/planner", {
      state: {
        websiteType,
        pages,
        features: selectedFeatures,
        budget: liveCost,
      },
    });
  };

  const plan =
    liveCost < 18000
      ? "Starter Plan"
      : liveCost < 32000
      ? "Pro Plan"
      : "Growth Plan";

  return (
    <div className="est-preview-card" style={{ background: "white", marginTop: "20px" }}>
      {/* Controls Form */}
      <div className="est-controls">
        {/* Step 1: Website Type */}
        <div className="est-control-group">
          <label htmlFor="est-website-type">Website Type</label>
          <select
            id="est-website-type"
            value={websiteType}
            onChange={(e) => setWebsiteType(e.target.value)}
            style={{
              padding: "12px",
              border: "1.5px solid var(--border)",
              borderRadius: "10px",
              fontSize: "15px",
              color: "var(--secondary)",
              outline: "none",
            }}
          >
            <option>Business</option>
            <option>Restaurant</option>
            <option>Portfolio</option>
            <option>E-Commerce</option>
            <option>Educational Institute</option>
            <option>Startup</option>
          </select>
        </div>

        {/* Step 2: Pages */}
        <div className="est-control-group">
          <label htmlFor="est-pages-slider">Number of Pages: <strong>{pages}</strong></label>
          <input
            type="range"
            min={1}
            max={30}
            value={pages}
            onChange={(e) => setPages(Number(e.target.value))}
            className="est-slider"
            id="est-pages-slider"
          />
          <div className="est-range-labels">
            <span>1 Page</span>
            <span>30 Pages</span>
          </div>
        </div>

        {/* Step 3: Features */}
        <div className="est-control-group">
          <label>Select Features</label>
          <div className="est-toggles">
            {[
              {
                label: "📅 Booking / Reservation System (+₹3,000)",
                checked: hasBooking,
                set: setHasBooking,
              },
              {
                label: "📝 Blog / Articles Section (+₹2,000)",
                checked: hasBlog,
                set: setHasBlog,
              },
              {
                label: "🔍 Advanced SEO Package (+₹4,000)",
                checked: hasSeo,
                set: setHasSeo,
              },
              {
                label: "💳 Payment Gateway Integration (+₹5,000)",
                checked: hasPayment,
                set: setHasPayment,
              },
              {
                label: "💬 WhatsApp Chat Widget (+₹1,000)",
                checked: hasWhatsapp,
                set: setHasWhatsapp,
              },
            ].map(({ label, checked, set }) => (
              <label className="est-toggle" key={label} style={{ userSelect: "none" }}>
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => set(e.target.checked)}
                />
                <span className="toggle-slider" />
                <span className="toggle-label">{label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Live Result Calculation */}
      <div className="est-result">
        <div className="est-result-inner">
          <p className="est-result-label">Estimated Live Cost</p>
          <div className="est-result-price">₹{liveCost.toLocaleString("en-IN")}</div>
          <div className="est-result-plan">{plan}</div>
          <p className="est-result-delivery">
            🗓️ Delivery Timeline: {pages <= 5 ? "3-5 Days" : pages <= 12 ? "7-9 Days" : "14-16 Days"}
          </p>
          <button
            onClick={handleContinue}
            className="btn btn-primary"
            style={{ marginTop: "24px", width: "100%" }}
          >
            Continue to Planner →
          </button>
        </div>
      </div>
    </div>
  );
}

export default BudgetEstimator;
