import "../../css/WhyChooseUs.css";

const features = [
  { icon: "📱", title: "Mobile First Design", desc: "Every site looks stunning on phones, tablets, and desktops — guaranteed." },
  { icon: "⚡", title: "Lightning Fast Delivery", desc: "Get your professional website ready in just 4–14 days, not months." },
  { icon: "💰", title: "100% Transparent Pricing", desc: "Use our live estimator to know the exact price before booking a call." },
  { icon: "🔍", title: "SEO-Ready from Day One", desc: "Built with performance, Core Web Vitals, and search engine rankings in mind." },
  { icon: "🤝", title: "Beginner Friendly Process", desc: "No tech knowledge needed. We handle everything and keep you updated." },
  { icon: "🛠️", title: "Ongoing Free Support", desc: "30 to 180 days of free post-launch support, edits, and maintenance." },
];

function WhyChooseUs() {
  return (
    <section className="why-section">
      <div className="container">
        <div className="text-center why-header">
          <span className="section-label">Why Us</span>
          <h2 className="section-title">Why Choose <span>WebNova?</span></h2>
          <p className="section-subtitle">Everything you need to launch a professional website with confidence and zero technical stress.</p>
        </div>

        <div className="why-grid">
          {features.map((f) => (
            <div className="why-card" key={f.title}>
              <div className="why-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhyChooseUs;