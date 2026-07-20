import "../../css/TrustedBy.css";

const brands = [
  { name: "SpiceGarden", icon: "🍽️" },
  { name: "Apex Consulting", icon: "💼" },
  { name: "Aura Store", icon: "🛍️" },
  { name: "Horizon Academy", icon: "🎓" },
  { name: "FlowTask SaaS", icon: "⚡" },
  { name: "Creative Studio", icon: "🎨" },
  { name: "Zara Boutique", icon: "👗" },
  { name: "TechLaunch", icon: "🚀" },
];

function TrustedBy() {
  return (
    <section className="trusted-section">
      <div className="container">
        <p className="trusted-label">Trusted by businesses across India</p>
        <div className="trusted-track-wrapper">
          <div className="trusted-track">
            {[...brands, ...brands].map((brand, i) => (
              <div className="trusted-brand" key={`${brand.name}-${i}`}>
                <span className="trusted-brand-icon">{brand.icon}</span>
                <span className="trusted-brand-name">{brand.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default TrustedBy;
