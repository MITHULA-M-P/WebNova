import type { Project } from "../types/portfolio";

import restaurantImg from "../assets/portfolio/restaurant.jpg";
import creativeImg from "../assets/portfolio/creative.jpg";
import consultingImg from "../assets/portfolio/consulting.jpg";
import shopImg from "../assets/portfolio/shop.jpg";
import academyImg from "../assets/portfolio/academy.jpg";
import saasImg from "../assets/portfolio/saas.jpg";

export const portfolioProjects: Project[] = [
  {
    id: 1,
    image: restaurantImg,
    name: "Spice Garden Restaurant",
    category: "Restaurant",
    description:
      "An elegant, responsive website featuring an interactive digital food menu, table reservation systems, and WhatsApp chat support.",
    technologies: ["React", "TypeScript", "Vanilla CSS", "HTML5"],
    demoUrl: "https://restaurant-demo.vercel.app",
  },
  {
    id: 2,
    image: creativeImg,
    name: "Creative Studio Portfolio",
    category: "Portfolio",
    description:
      "Minimalist portfolio showcasing creative work, photography projects, and custom interactive galleries for a design agency.",
    technologies: ["React", "TypeScript", "Vanilla CSS", "Mermaid.js"],
    demoUrl: "https://portfolio-demo.vercel.app",
  },
  {
    id: 3,
    image: consultingImg,
    name: "Apex Financial Consulting",
    category: "Business",
    description:
      "A secure and professional corporate website showcasing corporate services, team profiles, client case studies, and scheduling tools.",
    technologies: ["React", "TypeScript", "Vanilla CSS", "Google Maps"],
    demoUrl: "https://business-demo.vercel.app",
  },
  {
    id: 4,
    image: shopImg,
    name: "Aura E-Commerce Store",
    category: "E-Commerce",
    description:
      "A modern online marketplace featuring shopping cart, Razorpay payment integration, order tracking, and advanced SEO optimization.",
    technologies: ["React", "TypeScript", "CSS Grid", "Razorpay"],
    demoUrl: "https://ecommerce-demo.vercel.app",
  },
  {
    id: 5,
    image: academyImg,
    name: "Horizon Training Academy",
    category: "Education",
    description:
      "An educational platform for publishing courses, managing admissions, syllabus downloads, and student inquiries.",
    technologies: ["React", "TypeScript", "Vanilla CSS", "Forms"],
    demoUrl: "https://academy-demo.vercel.app",
  },
  {
    id: 6,
    image: saasImg,
    name: "FlowTask Startup",
    category: "Startup",
    description:
      "A SaaS landing page featuring pricing plans, email waitlist capture, smooth animations, and responsive design.",
    technologies: ["React", "TypeScript", "Flexbox", "LocalStorage"],
    demoUrl: "https://saas-demo.vercel.app",
  },
];