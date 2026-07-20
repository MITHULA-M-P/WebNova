export interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

export const faqs: FAQItem[] = [
  {
    id: 1,
    question: "What is WebNova?",
    answer: "WebNova is a boutique web development agency dedicated to building high-performance, responsive, and search-engine-optimized websites custom-tailored to client needs with zero technical stress."
  },
  {
    id: 2,
    question: "How long does it take to launch my website?",
    answer: "Our standard delivery ranges between 4 to 14 days depending on complexity. A Portfolio website takes about 5 days, while complex E-Commerce platforms with secure payments take around 10-14 days."
  },
  {
    id: 3,
    question: "Are there any hidden costs in the final pricing?",
    answer: "No, we believe in 100% transparent pricing. You can estimate your exact cost beforehand using our custom Budget Estimator or Planner Wizard. The price covers layout, development, basic SEO, and free maintenance support."
  },
  {
    id: 4,
    question: "Can I manage the website content myself after deployment?",
    answer: "Absolutely! Every website can be built with friendly administrative options (e.g. blogs, product dashboards) or integrated with CMS backends so you can upload blogs or edit menu items easily."
  },
  {
    id: 5,
    question: "Do you offer web hosting and domain services?",
    answer: "We assist in setting up your domains, custom business emails, and linking them to high-speed hosting providers (such as Cloudflare, Netlify, or Vercel) as part of our core pricing plans."
  }
];
