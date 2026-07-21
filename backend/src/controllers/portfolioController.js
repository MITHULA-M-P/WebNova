const prisma = require("../config/db");

// GET /api/portfolio (Public)
async function getPublicPortfolio(req, res, next) {
  try {
    const projects = await prisma.portfolio.findMany({
      orderBy: { created_at: "desc" },
    });

    const formatted = projects.map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      category: p.category,
      technologies: p.technologies.split(",").map((t) => t.trim()),
      imageUrl: p.image_url,
      githubUrl: p.github_url || "#",
      liveUrl: p.live_url || "#",
      isFeatured: p.is_featured,
    }));

    return res.json(formatted);
  } catch (error) {
    next(error);
  }
}

// GET /api/admin/portfolio (Admin)
async function getAllPortfolioAdmin(req, res, next) {
  try {
    const projects = await prisma.portfolio.findMany({
      orderBy: { created_at: "desc" },
    });
    return res.json(projects);
  } catch (error) {
    next(error);
  }
}

// POST /api/admin/portfolio
async function createPortfolio(req, res, next) {
  try {
    const { title, description, category, technologies, image_url, github_url, live_url, is_featured } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({ error: "Title, description, and category are required" });
    }

    const techString = Array.isArray(technologies) ? technologies.join(", ") : technologies || "";

    const newProject = await prisma.portfolio.create({
      data: {
        title,
        description,
        category,
        technologies: techString,
        image_url: image_url || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
        github_url: github_url || null,
        live_url: live_url || null,
        is_featured: Boolean(is_featured),
      },
    });

    return res.status(201).json(newProject);
  } catch (error) {
    next(error);
  }
}

// PUT /api/admin/portfolio/:id
async function updatePortfolio(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid portfolio ID" });

    const { title, description, category, technologies, image_url, github_url, live_url, is_featured } = req.body;

    const techString = Array.isArray(technologies) ? technologies.join(", ") : technologies;

    const updated = await prisma.portfolio.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(category !== undefined && { category }),
        ...(techString !== undefined && { technologies: techString }),
        ...(image_url !== undefined && { image_url }),
        ...(github_url !== undefined && { github_url }),
        ...(live_url !== undefined && { live_url }),
        ...(is_featured !== undefined && { is_featured: Boolean(is_featured) }),
      },
    });

    return res.json(updated);
  } catch (error) {
    next(error);
  }
}

// DELETE /api/admin/portfolio/:id
async function deletePortfolio(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid portfolio ID" });

    await prisma.portfolio.delete({ where: { id } });
    return res.json({ success: true, message: "Portfolio project deleted" });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getPublicPortfolio,
  getAllPortfolioAdmin,
  createPortfolio,
  updatePortfolio,
  deletePortfolio,
};
