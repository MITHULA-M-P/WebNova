import type { Template } from "../data/templates";
import type { Project } from "../types/portfolio";
import type { Review } from "../types/review";
import type { PlannerData } from "../types/planner";

const API_BASE_URL = "/api";

export interface ApiResponsePlan {
  id: number;
  customer_id: number;
  website_type: string;
  business_goal: string;
  pages: number;
  budget: number;
  brand_color?: string | null;
  has_logo: boolean;
  created_at: string;
  features: Array<{ id: number; plan_id: number; feature_name: string }>;
  customer: {
    id: number;
    business_name?: string | null;
    email: string;
    phone: string;
  };
}

export interface ApiResponseBooking {
  id: number;
  customerId?: number;
  customerName?: string;
  email?: string;
  phone?: string;
  date: string;
  time: string;
  status: string;
  message?: string | null;
  createdAt?: string;
  customer?: {
    id: number;
    business_name?: string | null;
    email: string;
    phone: string;
  };
}

export interface TimeSlot {
  id: number;
  day_of_week?: string;
  startTime: string;
  endTime: string;
  display?: string;
  time?: string;
  available?: boolean;
  is_active?: boolean;
}

export interface PricingPlan {
  id: number;
  name?: string;
  title?: string;
  price: number;
  period?: string;
  billing_cycle?: string;
  description: string;
  popular?: boolean;
  is_popular?: boolean;
  is_active?: boolean;
  features: Array<{ id?: number; text?: string; feature_name?: string; included?: boolean; is_included?: boolean }>;
}

export interface WebsiteSettings {
  id?: number;
  company_name: string;
  hero_title: string;
  hero_subtitle: string;
  about_text: string;
  contact_email: string;
  phone_number: string;
  office_address: string;
  social_twitter?: string;
  social_github?: string;
  social_linkedin?: string;
  social_instagram?: string;
  footer_text: string;
  logo_url?: string | null;
  favicon_url?: string | null;
}

export interface StatisticItem {
  id: number;
  label: string;
  value: string;
  prefix?: string;
  suffix?: string;
  displayValue?: string;
  icon?: string;
  display_order?: number;
}

// 1. Fetch templates
export async function getTemplates(): Promise<Template[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/templates`);
    if (!response.ok) throw new Error("Failed to fetch templates");
    return await response.json();
  } catch (error) {
    const mock = await import("../data/templates");
    return mock.templates;
  }
}

// 2. Fetch portfolio projects (Public)
export async function getPortfolio(): Promise<Project[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/portfolio`);
    if (!response.ok) throw new Error("Failed to fetch portfolio");
    return await response.json();
  } catch (error) {
    const mock = await import("../data/portfolio");
    return mock.portfolioProjects;
  }
}

// 3. Fetch reviews
export async function getReviews(): Promise<Review[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/reviews`);
    if (!response.ok) throw new Error("Failed to fetch reviews");
    return await response.json();
  } catch (error) {
    const mock = await import("../data/reviews");
    return mock.reviews;
  }
}

// 4. Create website plan
export async function createPlan(data: PlannerData): Promise<ApiResponsePlan> {
  const payload = {
    email: data.email,
    phone: data.phone,
    businessName: data.businessName,
    websiteType: data.websiteType,
    businessGoal: data.businessGoal,
    pages: data.pages,
    budget: data.budget,
    brandColor: data.brandColor || null,
    hasLogo: data.hasLogo,
    features: data.features,
  };

  const response = await fetch(`${API_BASE_URL}/planner`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || "Failed to save website plan");
  }

  return await response.json();
}

// 5. Get website plan by ID
export async function getPlanById(id: number | string): Promise<ApiResponsePlan> {
  const response = await fetch(`${API_BASE_URL}/planner/${id}`);
  if (!response.ok) throw new Error("Failed to retrieve plan details");
  return await response.json();
}

// 6. Create booking
export async function createBooking(data: {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  message?: string;
}): Promise<ApiResponseBooking> {
  const response = await fetch(`${API_BASE_URL}/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || "Failed to schedule booking");
  }

  return await response.json();
}

// 7. Dynamic Slot Availability (Public)
export async function getAvailableSlots(date?: string): Promise<TimeSlot[]> {
  try {
    const url = date ? `${API_BASE_URL}/slots/available?date=${encodeURIComponent(date)}` : `${API_BASE_URL}/slots/available`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch slots");
    return await response.json();
  } catch (err) {
    console.warn("Using fallback slot list:", err);
    return [
      { id: 1, startTime: "10:00 AM", endTime: "11:00 AM", available: true },
      { id: 2, startTime: "11:00 AM", endTime: "12:00 PM", available: true },
      { id: 3, startTime: "12:00 PM", endTime: "01:00 PM", available: true },
      { id: 4, startTime: "02:00 PM", endTime: "03:00 PM", available: true },
      { id: 5, startTime: "03:00 PM", endTime: "04:00 PM", available: true },
      { id: 6, startTime: "04:00 PM", endTime: "05:00 PM", available: true },
    ];
  }
}

// 8. Public Pricing Plans
export async function getPublicPlans(): Promise<PricingPlan[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/plans`);
    if (!response.ok) throw new Error("Failed to fetch pricing plans");
    return await response.json();
  } catch (err) {
    return [
      {
        id: 1,
        name: "Starter Launch",
        price: 14999,
        period: "one-time",
        description: "Essential landing site to start establishing your online brand.",
        popular: false,
        features: [
          { text: "1-3 Custom Pages", included: true },
          { text: "Responsive Mobile & Desktop", included: true },
          { text: "Basic SEO & Optimization", included: true },
          { text: "Contact & Booking Form", included: true },
        ],
      },
      {
        id: 2,
        name: "Business Growth",
        price: 34999,
        period: "one-time",
        description: "Full-featured multi-page custom website designed for conversions.",
        popular: true,
        features: [
          { text: "5-10 Custom Pages", included: true },
          { text: "Ultra-Fast Performance & SEO", included: true },
          { text: "Admin Content & Lead Portal", included: true },
          { text: "Interactive Booking System", included: true },
          { text: "Nodemailer Notification Engine", included: true },
        ],
      },
    ];
  }
}

// 9. Website Settings (Public)
export async function getWebsiteSettings(): Promise<WebsiteSettings> {
  try {
    const response = await fetch(`${API_BASE_URL}/settings`);
    if (!response.ok) throw new Error("Failed to fetch website settings");
    return await response.json();
  } catch (err) {
    return {
      company_name: "WebNova",
      hero_title: "We Build High-Converting Custom Websites",
      hero_subtitle: "Transforming your digital presence with modern web design and seamless development.",
      about_text: "WebNova is a premier digital agency building sleek, high-performing web applications.",
      contact_email: "contact@webnova.in",
      phone_number: "+91 98765 43210",
      office_address: "123 Tech Park, Innovation Way, Bangalore, India",
      footer_text: "© 2026 WebNova Studio. All rights reserved.",
    };
  }
}

// 10. Homepage Statistics (Public)
export async function getPublicStatistics(): Promise<StatisticItem[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/statistics`);
    if (!response.ok) throw new Error("Failed to fetch statistics");
    return await response.json();
  } catch (err) {
    return [
      { id: 1, label: "Projects Completed", value: "150", suffix: "+", icon: "🚀" },
      { id: 2, label: "Happy Clients", value: "98", suffix: "%", icon: "⭐" },
      { id: 3, label: "Years Experience", value: "8", suffix: "+", icon: "🏆" },
      { id: 4, label: "Support Available", value: "24/7", suffix: "", icon: "💬" },
    ];
  }
}
