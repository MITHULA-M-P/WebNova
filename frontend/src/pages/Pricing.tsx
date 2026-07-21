import { useEffect, useState } from "react";
import { getPublicPlans, type PricingPlan } from "../services/api";
import BudgetEstimator from "../components/estimator/BudgetEstimator";
import "../css/Pricing.css";

function Pricing() {
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPublicPlans()
      .then((data) => {
        setPlans(data);
      })
      .catch((err) => console.error("Error loading pricing plans:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="pricing-page page-content">
      {/* Header */}
      <section className="pricing-hero">
        <div className="container text-center">
          <span className="section-label">Cost Estimator</span>
          <h1 className="pricing-title">
            Calculate Your <span>Website Cost</span>
          </h1>
          <p className="pricing-subtitle">
            Select your website options, choose custom features, and see your live estimated cost instantly.
          </p>
        </div>
      </section>

      {/* Live Estimator Section */}
      <section className="estimator-calculator-section section" style={{ paddingBottom: "40px" }}>
        <div className="container">
          <BudgetEstimator />
        </div>
      </section>

      {/* Plans Section */}
      <section className="pricing-grid-section section" style={{ paddingTop: "40px" }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: "50px" }}>
            <span className="section-label">Fixed Packages</span>
            <h2>Or Choose a <span>Standard Plan</span></h2>
            <p className="section-subtitle">Pre-packaged configurations for businesses looking to launch quickly.</p>
          </div>

          {loading ? (
            <div style={{ textAlign: "center", color: "var(--muted)" }}>Loading website plans…</div>
          ) : (
            <div className="pricing-grid">
              {plans.map((plan) => {
                const isPopular = plan.popular || plan.is_popular;
                return (
                  <div
                    key={plan.id}
                    className={`pricing-card ${isPopular ? "featured-card" : ""}`}
                  >
                    {isPopular && <div className="card-badge">Most Popular</div>}
                    <div className="card-header">
                      <h3>{plan.name || plan.title}</h3>
                      <div className="card-price">
                        <span className="currency">₹</span>
                        <strong className="amount">{Number(plan.price).toLocaleString("en-IN")}</strong>
                        <span className="duration">/ {plan.period || plan.billing_cycle}</span>
                      </div>
                      <p className="delivery-time">{plan.description}</p>
                    </div>

                    <div className="card-body">
                      <p className="includes-label">Includes:</p>
                      <ul className="features-list">
                        {plan.features.map((feature, idx) => {
                          const fText = typeof feature === "string" ? feature : feature.text || feature.feature_name;
                          return (
                            <li key={idx}>
                              <span className="check-icon">✓</span>
                              <span>{fText}</span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>

                    <div className="card-footer">
                      <a
                        href={`/planner`}
                        className={`btn ${isPopular ? "btn-primary" : "btn-secondary"} w-full`}
                        style={{ textAlign: "center" }}
                      >
                        Choose Plan
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Custom Needs Section */}
      <section className="custom-plan-section text-center">
        <div className="container">
          <div className="custom-plan-inner">
            <h2>Need More Personalised Recommendations?</h2>
            <p>
              Use our interactive website planner to answer a few specific business questions, and our wizard will generate a complete blueprint for you.
            </p>
            <div className="custom-plan-actions">
              <a href="/planner" className="btn btn-primary">
                Use Website Planner
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

export default Pricing;
