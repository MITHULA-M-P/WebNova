const templatesData = [
  {
    id: 1,
    name: "Business",
    icon: "🏢",
    description: "Professional corporate layout customized to build credibility, showcase services, and gather direct client enquiries.",
    price: "₹9,999",
    delivery: "4-6 Days",
    pages: ["Home", "About Us", "Services", "Careers", "Contact Us"],
    features: ["Contact Form", "WhatsApp Chat", "Advanced SEO Setup", "Google Analytics Integration"]
  },
  {
    id: 2,
    name: "Restaurant",
    icon: "🍔",
    description: "Delicious layout featuring interactive digital menus, table reservation triggers, map locations, and WhatsApp ordering integrations.",
    price: "₹12,499",
    delivery: "5-7 Days",
    pages: ["Home", "Food Menu", "About Chef", "Table Reservation", "Contact"],
    features: ["Online Booking", "WhatsApp Chat", "Contact Form", "Google Maps Integration"]
  },
  {
    id: 3,
    name: "Portfolio",
    icon: "🎨",
    description: "Minimalist visual-focused gallery layout built for creatives, designers, photographers, or freelancers looking to show off their skills.",
    price: "₹7,999",
    delivery: "3-5 Days",
    pages: ["Home", "Project Gallery", "Resume / About", "Contact"],
    features: ["Gallery Slider", "Contact Form", "Social Integrations", "Responsive View Optimization"]
  },
  {
    id: 4,
    name: "E-Commerce",
    icon: "🛒",
    description: "Conversion-optimized shop layout with cart features, inventory alerts, automated confirmation receipts, and secure checkout portals.",
    price: "₹24,999",
    delivery: "10-14 Days",
    pages: ["Home", "Shop Collection", "Product Details", "Cart Summary", "Checkout", "Customer Dashboard"],
    features: ["Payment Gateway", "Blog / Articles", "Secure Database", "Inventory Status Flags", "Email Confirmation Setup"]
  },
  {
    id: 5,
    name: "Educational Institute",
    icon: "🏫",
    description: "Clean academic structure designed for syllabus downloads, admission enquiry forms, event updates, and department overviews.",
    price: "₹14,999",
    delivery: "6-8 Days",
    pages: ["Home", "Courses Offered", "Admission Form", "Events Calendar", "Faculty Directory", "Contact"],
    features: ["Contact Form", "PDF Download Facility", "Search Directory", "Responsive Setup"]
  },
  {
    id: 6,
    name: "Startup",
    icon: "🚀",
    description: "Sleek SaaS landing pages optimized to highlight features, custom pricing calculators, testimonials, and waitlist registration captures.",
    price: "₹11,999",
    delivery: "4-6 Days",
    pages: ["Home", "Product Features", "Pricing Calculator", "Blog", "Waitlist / Signup"],
    features: ["WhatsApp Chat", "Blog / Articles", "Waitlist capture database", "Custom pricing calculator"]
  }
];

const portfolioData = [
  {
    id: 1,
    image: "/assets/images/portfolio-spice.jpg",
    name: "Spice Garden Restaurant",
    category: "Restaurant",
    description: "An elegant, responsive website featuring an interactive digital food menu, table reservation systems, and WhatsApp chat support.",
    technologies: ["React", "TypeScript", "Vanilla CSS", "HTML5"],
    demoUrl: "#demo"
  },
  {
    id: 2,
    image: "/assets/images/portfolio-creative.jpg",
    name: "Creative Studio Portfolio",
    category: "Portfolio",
    description: "Minimalist portfolio showcasing creative work, photography projects, and custom interactive galleries for a design agency.",
    technologies: ["React", "TypeScript", "Vanilla CSS", "Mermaid.js"],
    demoUrl: "#demo"
  },
  {
    id: 3,
    image: "/assets/images/portfolio-consulting.jpg",
    name: "Apex Financial Consulting",
    category: "Business",
    description: "A secure and professional corporate website showcasing corporate services, team profiles, client case studies, and scheduling tools.",
    technologies: ["React", "TypeScript", "Vanilla CSS", "Google Maps"],
    demoUrl: "#demo"
  },
  {
    id: 4,
    image: "/assets/images/portfolio-shop.jpg",
    name: "Aura E-Commerce Store",
    category: "E-Commerce",
    description: "A fast online marketplace featuring cart management, Razorpay payment gateway, order summary emails, and advanced SEO.",
    technologies: ["React", "TypeScript", "CSS Grid", "Razorpay"],
    demoUrl: "#demo"
  },
  {
    id: 5,
    image: "/assets/images/portfolio-academy.jpg",
    name: "Horizon Training Academy",
    category: "Educational Institute",
    description: "An educational platform designed for publishing course curriculum, managing syllabus downloads, and taking admission applications.",
    technologies: ["React", "TypeScript", "Vanilla CSS", "Forms"],
    demoUrl: "#demo"
  },
  {
    id: 6,
    image: "/assets/images/portfolio-saas.jpg",
    name: "FlowTask Startup Landing",
    category: "Startup",
    description: "A conversion-focused SaaS startup page featuring custom pricing plan calculators, email waitlist capture, and smooth animations.",
    technologies: ["React", "TypeScript", "Flexbox", "LocalStorage"],
    demoUrl: "#demo"
  }
];

const reviewsData = [
  {
    id: 1,
    avatar: "👨‍💼",
    name: "Rohan Sharma",
    company: "Spice Garden Restaurant",
    rating: 5,
    review: "WebNova built a wonderful site for us. Our table reservations increased by 40% in the first month itself! The design looks premium and runs incredibly fast on mobile phones."
  },
  {
    id: 2,
    avatar: "👩‍🎨",
    name: "Elena Rostova",
    company: "Creative Studio",
    rating: 5,
    review: "Working with the team was a breeze. They delivered a fully functional web portfolio in under 5 days. The clean grid layout and custom animations perfectly capture my brand's aesthetics!"
  },
  {
    id: 3,
    avatar: "👨‍💻",
    name: "Vikram Malhotra",
    company: "Apex Consulting",
    rating: 5,
    review: "Highly professional service! Transparent pricing and prompt delivery. They translated our complex business requirements into a clean, modern SaaS landing page. Highly recommend them."
  },
  {
    id: 4,
    avatar: "👩‍💼",
    name: "Neha Patel",
    company: "Aura E-Commerce",
    rating: 4,
    review: "Excellent experience. The team handled payment gateway setup, order confirmations, and inventory flags flawlessly. The page speeds are top-tier and our clients love the shopping checkout flow."
  },
  {
    id: 5,
    avatar: "🏫",
    name: "Dr. Alok Verma",
    company: "Horizon Academy",
    rating: 5,
    review: "We needed an admission application form and syllabus brochure down-link quickly. WebNova delivered everything in 8 days. The layout is clean and user experience is very beginner-friendly."
  }
];

// GET /api/templates
function getTemplates(req, res) {
  return res.json(templatesData);
}

// GET /api/portfolio
function getPortfolio(req, res) {
  return res.json(portfolioData);
}

// GET /api/reviews
function getReviews(req, res) {
  return res.json(reviewsData);
}

module.exports = {
  getTemplates,
  getPortfolio,
  getReviews,
};
