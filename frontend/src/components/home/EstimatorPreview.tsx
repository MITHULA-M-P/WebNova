import { useState } from "react";
import "../../css/EstimatorPreview.css";
import { Link } from "react-router-dom";

function EstimatorPreview() {
  const [pages, setPages] = useState(5);
  const [hasBooking, setHasBooking] = useState(false);
  const [hasBlog, setHasBlog] = useState(false);
  const [hasSeo, setHasSeo] = useState(false);

  const base = 8000;
  const perPage = 800;
  const bookingCost = hasBooking ? 3000 : 0;
  const blogCost = hasBlog ? 2000 : 0;
  const seoCost = hasSeo ? 4000 : 0;
  const total = base + pages * perPage + bookingCost + blogCost + seoCost;

  const plan = total < 15000 ? "Starter Plan" : total < 30000 ? "Pro Plan" : "Growth Plan";

  return (
    <section className="est-preview-section">
      <div className="container">
        <div className="text-center est-header">
          <span className="section-label">Cost Estimator</span>
          <h2 className="section-title">Know Your <span>Website Budget</span></h2>
          <p className="section-subtitle">Get a real-time estimate before committing. No surprises, ever.</p>
        </div>

        <div className="est-preview-card">
          <div className="est-controls">
            <div className="est-control-group">
              <label>Number of Pages: <strong>{pages}</strong></label>
              <input
                type="range"
                min={1}
                max={20}
                value={pages}
                onChange={(e) => setPages(Number(e.target.value))}
                className="est-slider"
                id="est-pages-slider"
              />
              <div className="est-range-labels"><span>1</span><span>20</span></div>
            </div>

            <div className="est-toggles">
              {[
                { label: "📅 Booking / Reservation System", checked: hasBooking, set: setHasBooking },
                { label: "📝 Blog / Articles Section", checked: hasBlog, set: setHasBlog },
                { label: "🔍 Advanced SEO Package", checked: hasSeo, set: setHasSeo },
              ].map(({ label, checked, set }) => (
                <label className="est-toggle" key={label}>
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

          <div className="est-result">
            <div className="est-result-inner">
              <p className="est-result-label">Estimated Cost</p>
              <div className="est-result-price">₹{total.toLocaleString("en-IN")}</div>
              <div className="est-result-plan">{plan}</div>
              <p className="est-result-delivery">
                🗓️ Delivery: {pages <= 5 ? "3-5 Days" : pages <= 10 ? "7-9 Days" : "12-14 Days"}
              </p>
              <Link to="/pricing" className="btn btn-primary" style={{ marginTop: "20px", width: "100%", textAlign: "center" }}>
                Get Full Estimate →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default EstimatorPreview;
