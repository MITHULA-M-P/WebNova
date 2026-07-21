const prisma = require("../config/db");

// GET /api/settings (Public & Admin)
async function getSettings(req, res, next) {
  try {
    let settings = await prisma.websiteSettings.findFirst();
    if (!settings) {
      settings = await prisma.websiteSettings.create({
        data: {
          company_name: "WebNova",
          hero_title: "We Build High-Converting Custom Websites",
          hero_subtitle: "Transforming your digital presence with modern web design, seamless development, and optimized conversion strategies.",
          about_text: "WebNova is a premier digital agency building sleek, high-performing websites and web applications.",
          contact_email: "contact@webnova.in",
          phone_number: "+91 98765 43210",
          office_address: "123 Tech Park, Innovation Way, Bangalore, India",
        },
      });
    }
    return res.json(settings);
  } catch (error) {
    next(error);
  }
}

// PUT /api/admin/settings (Admin update settings)
async function updateSettings(req, res, next) {
  try {
    const existing = await prisma.websiteSettings.findFirst();
    const data = req.body;

    let updated;
    if (existing) {
      updated = await prisma.websiteSettings.update({
        where: { id: existing.id },
        data: {
          ...(data.company_name !== undefined && { company_name: data.company_name }),
          ...(data.hero_title !== undefined && { hero_title: data.hero_title }),
          ...(data.hero_subtitle !== undefined && { hero_subtitle: data.hero_subtitle }),
          ...(data.about_text !== undefined && { about_text: data.about_text }),
          ...(data.contact_email !== undefined && { contact_email: data.contact_email }),
          ...(data.phone_number !== undefined && { phone_number: data.phone_number }),
          ...(data.office_address !== undefined && { office_address: data.office_address }),
          ...(data.social_twitter !== undefined && { social_twitter: data.social_twitter }),
          ...(data.social_github !== undefined && { social_github: data.social_github }),
          ...(data.social_linkedin !== undefined && { social_linkedin: data.social_linkedin }),
          ...(data.social_instagram !== undefined && { social_instagram: data.social_instagram }),
          ...(data.footer_text !== undefined && { footer_text: data.footer_text }),
          ...(data.logo_url !== undefined && { logo_url: data.logo_url }),
          ...(data.favicon_url !== undefined && { favicon_url: data.favicon_url }),
        },
      });
    } else {
      updated = await prisma.websiteSettings.create({
        data: {
          company_name: data.company_name || "WebNova",
          hero_title: data.hero_title || "We Build High-Converting Custom Websites",
          hero_subtitle: data.hero_subtitle || "Transforming your digital presence.",
          about_text: data.about_text || "",
          contact_email: data.contact_email || "contact@webnova.in",
          phone_number: data.phone_number || "+91 98765 43210",
          office_address: data.office_address || "",
          social_twitter: data.social_twitter || "",
          social_github: data.social_github || "",
          social_linkedin: data.social_linkedin || "",
          social_instagram: data.social_instagram || "",
          footer_text: data.footer_text || "© 2026 WebNova. All rights reserved.",
          logo_url: data.logo_url || null,
          favicon_url: data.favicon_url || null,
        },
      });
    }

    return res.json(updated);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getSettings,
  updateSettings,
};
