const prisma = require("../config/db");

// GET /api/plans (Public active plans)
async function getPublicPlans(req, res, next) {
  try {
    const plans = await prisma.pricingPlan.findMany({
      where: { is_active: true },
      include: { features: true },
      orderBy: { price: "asc" },
    });

    const formatted = plans.map((p) => ({
      id: p.id,
      name: p.title,
      price: p.price,
      period: p.billing_cycle,
      description: p.description,
      popular: p.is_popular,
      features: p.features.map((f) => ({
        id: f.id,
        text: f.feature_name,
        included: f.is_included,
      })),
    }));

    return res.json(formatted);
  } catch (error) {
    next(error);
  }
}

// GET /api/admin/plans (Admin all plans)
async function getAllPlansAdmin(req, res, next) {
  try {
    const plans = await prisma.pricingPlan.findMany({
      include: { features: true },
      orderBy: { id: "asc" },
    });
    return res.json(plans);
  } catch (error) {
    next(error);
  }
}

// POST /api/admin/plans
async function createPlan(req, res, next) {
  try {
    const { title, description, price, billing_cycle = "one-time", is_active = true, is_popular = false, features = [] } = req.body;

    if (!title || price === undefined) {
      return res.status(400).json({ error: "Title and Price are required" });
    }

    const featureData = Array.isArray(features)
      ? features.map((f) =>
          typeof f === "string"
            ? { feature_name: f, is_included: true }
            : { feature_name: f.feature_name || f.text || "", is_included: f.is_included !== undefined ? f.is_included : true }
        )
      : [];

    const newPlan = await prisma.pricingPlan.create({
      data: {
        title,
        description: description || "",
        price: parseFloat(price),
        billing_cycle,
        is_active: Boolean(is_active),
        is_popular: Boolean(is_popular),
        features: {
          create: featureData,
        },
      },
      include: { features: true },
    });

    return res.status(201).json(newPlan);
  } catch (error) {
    next(error);
  }
}

// PUT /api/admin/plans/:id
async function updatePlan(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid plan ID" });

    const { title, description, price, billing_cycle, is_active, is_popular, features } = req.body;

    // Update basic plan data
    const updated = await prisma.pricingPlan.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(price !== undefined && { price: parseFloat(price) }),
        ...(billing_cycle !== undefined && { billing_cycle }),
        ...(is_active !== undefined && { is_active: Boolean(is_active) }),
        ...(is_popular !== undefined && { is_popular: Boolean(is_popular) }),
      },
    });

    // If features array is provided, replace existing features
    if (Array.isArray(features)) {
      await prisma.pricingFeature.deleteMany({ where: { plan_id: id } });
      const featureData = features.map((f) =>
        typeof f === "string"
          ? { plan_id: id, feature_name: f, is_included: true }
          : { plan_id: id, feature_name: f.feature_name || f.text || "", is_included: f.is_included !== undefined ? f.is_included : true }
      );
      await prisma.pricingFeature.createMany({ data: featureData });
    }

    const result = await prisma.pricingPlan.findUnique({
      where: { id },
      include: { features: true },
    });

    return res.json(result);
  } catch (error) {
    next(error);
  }
}

// DELETE /api/admin/plans/:id
async function deletePlan(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid plan ID" });

    await prisma.pricingPlan.delete({ where: { id } });
    return res.json({ success: true, message: "Website plan deleted" });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getPublicPlans,
  getAllPlansAdmin,
  createPlan,
  updatePlan,
  deletePlan,
};
