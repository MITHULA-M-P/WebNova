import Hero from "../components/home/Hero";
import TrustedBy from "../components/home/TrustedBy";
import WhyChooseUs from "../components/home/WhyChooseUs";
import HowItWorks from "../components/home/HowItWorks";
import FeaturedTemplates from "../components/home/FeaturedTemplates";
import EstimatorPreview from "../components/home/EstimatorPreview";
import PortfolioPreview from "../components/home/PortfolioPreview";
import ReviewsPreview from "../components/home/ReviewsPreview";
import FaqPreview from "../components/home/FaqPreview";

function Home() {
  return (
    <>
      <Hero />
      <TrustedBy />
      <WhyChooseUs />
      <HowItWorks />
      <FeaturedTemplates />
      <EstimatorPreview />
      <PortfolioPreview />
      <ReviewsPreview />
      <FaqPreview />

      {/* Book Discovery Call CTA */}
      <section className="home-cta-section section">
        <div className="container text-center">
          <span className="section-label">Get Started</span>
          <h2 className="section-title">
            Ready to Build Your <span>Dream Website</span>?
          </h2>
          <p className="section-subtitle" style={{ margin: "0 auto 32px" }}>
            Tell us your idea. We'll craft a personalised plan and launch your
            website in as little as 5 days.
          </p>
          <div className="flex-center gap-4" style={{ flexWrap: "wrap", justifyContent: "center" }}>
            <a href="/planner" className="btn btn-primary">
              Plan My Website →
            </a>
            <a href="/book-call" className="btn btn-secondary">
              Book Discovery Call
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;