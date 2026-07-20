import { useState, useEffect } from "react";
import type { Review } from "../types/review";
import { getReviews } from "../services/api";
import "../css/Reviews.css";

function Reviews() {
  const [reviewsList, setReviewsList] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const stats = [
    { label: "Happy Clients", value: "50+" },
    { label: "Average Rating", value: "4.9/5" },
    { label: "On-Time Delivery", value: "100%" },
  ];

  useEffect(() => {
    getReviews()
      .then((data) => setReviewsList(data))
      .catch((err) => {
        console.error(err);
        setError("Failed to load customer reviews.");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="reviews-page page-content">
      {/* Header */}
      <section className="reviews-hero section">
        <div className="container text-center">
          <span className="section-label">Testimonials</span>
          <h1 className="section-title">
            What Our Clients <span>Say</span>
          </h1>
          <p className="section-subtitle">
            Don't just take our word for it. Read honest feedback and success stories from businesses we've collaborated with.
          </p>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="reviews-stats-bar">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-item text-center">
                <h3>{stat.value}</h3>
                <p>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Grid */}
      <section className="reviews-grid-section section" style={{ minHeight: "300px" }}>
        <div className="container">
          {loading && (
            <div className="text-center" style={{ padding: "40px" }}>
              <p>Loading client reviews...</p>
            </div>
          )}

          {error && (
            <div className="text-center" style={{ padding: "40px", color: "red" }}>
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && (
            <div className="reviews-grid">
              {reviewsList.map((item) => (
                <div key={item.id} className="review-page-card">
                  <div className="card-top">
                    <div className="stars-container">
                      {"★".repeat(item.rating)}
                      {"☆".repeat(5 - item.rating)}
                    </div>
                    <span className="quote-mark">“</span>
                  </div>

                  <p className="review-quote-text">"{item.review}"</p>

                  <div className="review-author-info">
                    <span className="author-avatar-emoji">{item.avatar}</span>
                    <div>
                      <h4 className="author-name">{item.name}</h4>
                      <p className="author-company">{item.company}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="reviews-cta-section text-center section">
        <div className="container">
          <div className="reviews-cta-inner">
            <span className="section-label">Collaborate</span>
            <h2>Ready to Write Your Success Story?</h2>
            <p>
              Join dozens of satisfied business owners who launched their sites with zero headache.
            </p>
            <div className="reviews-cta-actions">
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

export default Reviews;
