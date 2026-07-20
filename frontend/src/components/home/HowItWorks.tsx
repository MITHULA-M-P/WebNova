import "../../css/HowItWorks.css";

const steps = [
  { number: "01", icon: "💡", title: "Tell Us Your Idea", desc: "Share your business vision and goals through our quick guided Planner Wizard — no tech knowledge needed." },
  { number: "02", icon: "🗺️", title: "Get a Website Plan", desc: "We recommend the perfect pages, features, estimated cost, and timeline based on your inputs." },
  { number: "03", icon: "📅", title: "Book a Discovery Call", desc: "Choose a convenient time slot. Our team will personally walk you through your custom website plan." },
  { number: "04", icon: "🚀", title: "We Design & Launch", desc: "Sit back while we build, test, and launch your stunning, high-performance website on time." },
];

function HowItWorks() {
  return (
    <section className="how-section">
      <div className="container">
        <div className="text-center how-header">
          <span className="section-label">The Process</span>
          <h2 className="section-title">How It <span>Works</span></h2>
          <p className="section-subtitle">Getting your website is a simple, stress-free 4-step journey.</p>
        </div>

        <div className="how-steps">
          {steps.map((step, i) => (
            <div className="how-step" key={step.number}>
              <div className="step-number-badge">{step.number}</div>
              <div className="step-icon">{step.icon}</div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
              {i < steps.length - 1 && <div className="step-connector" />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;