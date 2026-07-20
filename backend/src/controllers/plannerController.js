const { z } = require("zod");
const prisma = require("../config/db");

// Zod validation schemas
const createPlanSchema = z.object({
  email: z.string().email("Invalid email format"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  businessName: z.string().min(1, "Business name is required"),
  websiteType: z.string().min(1, "Website type is required"),
  businessGoal: z.string().min(1, "Business goal is required"),
  pages: z.number().int().min(1, "Pages must be at least 1"),
  budget: z.number().min(0, "Budget cannot be negative"),
  brandColor: z.string().optional().nullable(),
  hasLogo: z.boolean().default(false),
  features: z.array(z.string()).default([]),
});

const updatePlanSchema = createPlanSchema.partial();

// POST /api/planner
async function createPlan(req, res, next) {
  try {
    const data = req.validatedBody;

    // 1. Find or create customer
    const customer = await prisma.customer.upsert({
      where: { email: data.email },
      update: {
        business_name: data.businessName,
        phone: data.phone,
      },
      create: {
        email: data.email,
        phone: data.phone,
        business_name: data.businessName,
      },
    });

    // 2. Create WebsitePlan & Features
    const plan = await prisma.websitePlan.create({
      data: {
        customer_id: customer.id,
        website_type: data.websiteType,
        business_goal: data.businessGoal,
        pages: data.pages,
        budget: data.budget,
        brand_color: data.brandColor || null,
        has_logo: data.hasLogo,
        features: {
          create: data.features.map((featureName) => ({
            feature_name: featureName,
          })),
        },
      },
      include: {
        features: true,
        customer: true,
      },
    });

    return res.status(201).json(plan);
  } catch (error) {
    next(error);
  }
}

// GET /api/planner
async function getAllPlans(req, res, next) {
  try {
    const plans = await prisma.websitePlan.findMany({
      include: {
        features: true,
        customer: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });
    return res.json(plans);
  } catch (error) {
    next(error);
  }
}

// GET /api/planner/:id
async function getPlanById(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid plan ID" });
    }

    const plan = await prisma.websitePlan.findUnique({
      where: { id },
      include: {
        features: true,
        customer: true,
      },
    });

    if (!plan) {
      return res.status(404).json({ error: "Plan not found" });
    }

    return res.json(plan);
  } catch (error) {
    next(error);
  }
}

// PUT /api/planner/:id
async function updatePlan(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid plan ID" });
    }

    const data = req.validatedBody;

    // Check if plan exists
    const existingPlan = await prisma.websitePlan.findUnique({
      where: { id },
    });

    if (!existingPlan) {
      return res.status(404).json({ error: "Plan not found" });
    }

    // Prepare update data
    const updateData = {};
    if (data.websiteType !== undefined) updateData.website_type = data.websiteType;
    if (data.businessGoal !== undefined) updateData.business_goal = data.businessGoal;
    if (data.pages !== undefined) updateData.pages = data.pages;
    if (data.budget !== undefined) updateData.budget = data.budget;
    if (data.brandColor !== undefined) updateData.brand_color = data.brandColor;
    if (data.hasLogo !== undefined) updateData.has_logo = data.hasLogo;

    // If features are provided, delete old ones and create new ones
    if (data.features !== undefined) {
      updateData.features = {
        deleteMany: {},
        create: data.features.map((featureName) => ({
          feature_name: featureName,
        })),
      };
    }

    const updatedPlan = await prisma.websitePlan.update({
      where: { id },
      data: updateData,
      include: {
        features: true,
        customer: true,
      },
    });

    return res.json(updatedPlan);
  } catch (error) {
    next(error);
  }
}

// DELETE /api/planner/:id
async function deletePlan(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid plan ID" });
    }

    const existingPlan = await prisma.websitePlan.findUnique({
      where: { id },
    });

    if (!existingPlan) {
      return res.status(404).json({ error: "Plan not found" });
    }

    await prisma.websitePlan.delete({
      where: { id },
    });

    return res.json({ message: "Plan deleted successfully" });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createPlanSchema,
  updatePlanSchema,
  createPlan,
  getAllPlans,
  getPlanById,
  updatePlan,
  deletePlan,
};
