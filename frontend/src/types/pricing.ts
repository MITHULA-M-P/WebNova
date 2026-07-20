export interface PricingPlan {
  id: number;
  name: string;
  basePrice: number;
  pages: number;
  features: string[];
  estimatedDelivery: string;
}
