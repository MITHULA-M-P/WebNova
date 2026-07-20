import type { Template } from "../data/templates";
import type { Project } from "../types/portfolio";
import type { Review } from "../types/review";
import type { PlannerData } from "../types/planner";

const API_BASE_URL = "/api"; // Vite dev proxy will forward to http://localhost:5000

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
  customer_id: number;
  booking_date: string;
  booking_time: string;
  status: string;
  message?: string | null;
  created_at: string;
  customer: {
    id: number;
    business_name?: string | null;
    email: string;
    phone: string;
  };
}

// 1. Fetch templates list
export async function getTemplates(): Promise<Template[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/templates`);
    if (!response.ok) throw new Error("Failed to fetch templates");
    return await response.json();
  } catch (error) {
    console.warn("API templates fetch failed, falling back to mock data:", error);
    const mock = await import("../data/templates");
    return mock.templates;
  }
}

// 2. Fetch portfolio projects
export async function getPortfolio(): Promise<Project[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/portfolio`);
    if (!response.ok) throw new Error("Failed to fetch portfolio");
    return await response.json();
  } catch (error) {
    console.warn("API portfolio fetch failed, falling back to mock data:", error);
    const mock = await import("../data/portfolio");
    return mock.portfolioProjects;
  }
}

// 3. Fetch reviews/testimonials
export async function getReviews(): Promise<Review[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/reviews`);
    if (!response.ok) throw new Error("Failed to fetch reviews");
    return await response.json();
  } catch (error) {
    console.warn("API reviews fetch failed, falling back to mock data:", error);
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
    headers: {
      "Content-Type": "application/json",
    },
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
  if (!response.ok) {
    throw new Error("Failed to retrieve plan details");
  }
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
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || "Failed to schedule booking");
  }

  return await response.json();
}
