import type { PricingPlan } from "../types/pricing";

export const pricingPlans: PricingPlan[] = [
  {
    id: 1,
    name: "Starter Plan",
    basePrice: 9999,
    pages: 5,
    features: [
      "Responsive Layout (Mobile-first)",
      "Standard Contact Form",
      "WhatsApp Chat Button Integration",
      "Basic On-Page SEO Setup",
      "Standard Domain & Hosting Linking",
      "1 Month Free Support & Edits"
    ],
    estimatedDelivery: "3-5 Days"
  },
  {
    id: 2,
    name: "Pro Plan",
    basePrice: 19999,
    pages: 10,
    features: [
      "All features in Starter Plan Included",
      "Custom Blog / Article Section",
      "Interactive Table / Service Booking System",
      "Custom Dynamic Content (Filters & Tabs)",
      "Speed Optimization & Cloudflare Setup",
      "Advanced SEO Optimization Setup",
      "3 Months Premium Support"
    ],
    estimatedDelivery: "7-9 Days"
  },
  {
    id: 3,
    name: "Growth Plan",
    basePrice: 39999,
    pages: 20,
    features: [
      "All features in Pro Plan Included",
      "Full E-Commerce Store Integration",
      "Secure Payment Gateway Setup (Stripe/Razorpay)",
      "Admin Inventory Management Dashboard",
      "Automated Order Confirmation via Email",
      "Live Chat & CRM Dashboard Linkage",
      "6 Months VIP Support & Maintenance"
    ],
    estimatedDelivery: "14-16 Days"
  }
];