export interface Template {
  id: number;
  name: string;
  icon: string;
  description: string;
  pages: string[];
  features: string[];
  price: string;
  delivery: string;
}

export const templates: Template[] = [
  {
    id: 1,
    name: "Business",
    icon: "🏢",
    description: "Professional website for companies.",
    pages: ["Home", "About", "Services", "Contact"],
    features: ["SEO", "WhatsApp", "Contact Form"],
    price: "₹12,000",
    delivery: "5-7 Days",
  },
  {
    id: 2,
    name: "Restaurant",
    icon: "🍽️",
    description: "Restaurant website.",
    pages: ["Home", "Menu", "Gallery", "Contact"],
    features: ["Booking", "Google Maps", "WhatsApp"],
    price: "₹15,000",
    delivery: "7 Days",
  },
  {
    id: 3,
    name: "Portfolio",
    icon: "🎨",
    description: "Portfolio website.",
    pages: ["Home", "About", "Projects", "Contact"],
    features: ["Gallery", "Resume"],
    price: "₹10,000",
    delivery: "4-5 Days",
  },
];