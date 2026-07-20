import { Link } from "react-router-dom";
import { reviews } from "../../data/reviews";
import "../../css/ReviewsPreview.css";

function ReviewsPreview() {
  const preview = reviews.slice(0, 3);

  return (
    <section className="rvp-section">
      <div className="container">
        <div className="text-center rvp-header">
          <span className="section-label">Testimonials</span>
          <h2 className="section-title">What Clients <span>Say About Us</span></h2>
          <p className="section-subtitle">Real results. Real people. See how we've helped businesses across India grow online.</p>
        </div>

        <div className="rvp-grid">
          {preview.map((r) => (
            <div className="rvp-card" key={r.id}>
              <div className="rvp-stars">
                {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}
              </div>
              <p className="rvp-text">"{r.review}"</p>
              <div className="rvp-author">
                <div className="rvp-avatar">{r.avatar}</div>
                <div>
                  <strong>{r.name}</strong>
                  <span>{r.company}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center" style={{ marginTop: "44px" }}>
          <Link to="/reviews" className="btn btn-secondary">Read All Reviews →</Link>
        </div>
      </div>
    </section>
  );
}

export default ReviewsPreview;
