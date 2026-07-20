import { useState } from "react";
import { faqs } from "../../data/faq";
import "../../css/FaqPreview.css";

function FaqPreview() {
  const [openId, setOpenId] = useState<number | null>(null);

  return (
    <section className="faq-section">
      <div className="container">
        <div className="text-center faq-header">
          <span className="section-label">FAQ</span>
          <h2 className="section-title">Frequently Asked <span>Questions</span></h2>
          <p className="section-subtitle">Everything you need to know about working with WebCraft Studio.</p>
        </div>

        <div className="faq-list">
          {faqs.map((item) => (
            <div
              key={item.id}
              className={`faq-item ${openId === item.id ? "faq-open" : ""}`}
            >
              <button
                className="faq-question"
                onClick={() => setOpenId(openId === item.id ? null : item.id)}
                aria-expanded={openId === item.id}
                id={`faq-btn-${item.id}`}
              >
                <span>{item.question}</span>
                <span className="faq-icon">{openId === item.id ? "−" : "+"}</span>
              </button>

              {openId === item.id && (
                <div className="faq-answer">
                  <p>{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FaqPreview;
