const prisma = require("../config/db");

// GET /api/statistics (Public)
async function getPublicStatistics(req, res, next) {
  try {
    const stats = await prisma.statistic.findMany({
      orderBy: { display_order: "asc" },
    });

    const formatted = stats.map((s) => ({
      id: s.id,
      label: s.label,
      value: s.value,
      prefix: s.prefix || "",
      suffix: s.suffix || "",
      displayValue: `${s.prefix || ""}${s.value}${s.suffix || ""}`,
      icon: s.icon || "📊",
    }));

    return res.json(formatted);
  } catch (error) {
    next(error);
  }
}

// GET /api/admin/statistics (Admin)
async function getAllStatisticsAdmin(req, res, next) {
  try {
    const stats = await prisma.statistic.findMany({
      orderBy: { display_order: "asc" },
    });
    return res.json(stats);
  } catch (error) {
    next(error);
  }
}

// POST /api/admin/statistics
async function createStatistic(req, res, next) {
  try {
    const { label, value, prefix = "", suffix = "", icon = "📊", display_order = 0 } = req.body;

    if (!label || value === undefined) {
      return res.status(400).json({ error: "Label and Value are required" });
    }

    const newStat = await prisma.statistic.create({
      data: {
        label,
        value: String(value),
        prefix,
        suffix,
        icon,
        display_order: parseInt(display_order) || 0,
      },
    });

    return res.status(201).json(newStat);
  } catch (error) {
    next(error);
  }
}

// PUT /api/admin/statistics/:id
async function updateStatistic(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid statistic ID" });

    const { label, value, prefix, suffix, icon, display_order } = req.body;

    const updated = await prisma.statistic.update({
      where: { id },
      data: {
        ...(label !== undefined && { label }),
        ...(value !== undefined && { value: String(value) }),
        ...(prefix !== undefined && { prefix }),
        ...(suffix !== undefined && { suffix }),
        ...(icon !== undefined && { icon }),
        ...(display_order !== undefined && { display_order: parseInt(display_order) }),
      },
    });

    return res.json(updated);
  } catch (error) {
    next(error);
  }
}

// DELETE /api/admin/statistics/:id
async function deleteStatistic(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid statistic ID" });

    await prisma.statistic.delete({ where: { id } });
    return res.json({ success: true, message: "Statistic deleted" });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getPublicStatistics,
  getAllStatisticsAdmin,
  createStatistic,
  updateStatistic,
  deleteStatistic,
};
