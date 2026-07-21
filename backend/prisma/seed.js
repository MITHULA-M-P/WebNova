const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // 1. Seed Admin
  const hashedAdminPassword = await bcrypt.hash("admin123", 10);
  await prisma.admin.upsert({
    where: { email: "admin@webnova.com" },
    update: { password: hashedAdminPassword },
    create: {
      name: "Super Admin",
      email: "admin@webnova.com",
      password: hashedAdminPassword,
    },
  });
  console.log("✔ Admin user created: admin@webnova.com / admin123");

  // 2. Seed Time Slots
  const defaultSlots = [
    { day_of_week: "all", start_time: "10:00 AM", end_time: "11:00 AM", is_active: true },
    { day_of_week: "all", start_time: "11:00 AM", end_time: "12:00 PM", is_active: true },
    { day_of_week: "all", start_time: "12:00 PM", end_time: "01:00 PM", is_active: true },
    { day_of_week: "all", start_time: "02:00 PM", end_time: "03:00 PM", is_active: true },
    { day_of_week: "all", start_time: "03:00 PM", end_time: "04:00 PM", is_active: true },
    { day_of_week: "all", start_time: "04:00 PM", end_time: "05:00 PM", is_active: true },
  ];

  const countSlots = await prisma.timeSlot.count();
  if (countSlots === 0) {
    await prisma.timeSlot.createMany({ data: defaultSlots });
    console.log("✔ Default time slots created");
  }

  // 3. Seed Website Settings
  const existingSettings = await prisma.websiteSettings.findFirst();
  if (!existingSettings) {
    await prisma.websiteSettings.create({
      data: {
        company_name: "WebNova",
        hero_title: "We Build High-Converting Custom Websites",
        hero_subtitle: "Transforming your digital presence with modern web design, seamless development, and optimized conversion strategies.",
        about_text: "WebNova is a premier digital agency building sleek, high-performing websites and web applications tailored for modern growing businesses.",
        contact_email: "contact@webnova.in",
        phone_number: "+91 98765 43210",
        office_address: "123 Tech Park, Innovation Way, Bangalore, India",
        social_twitter: "https://twitter.com/webnova",
        social_github: "https://github.com/webnova",
        social_linkedin: "https://linkedin.com/company/webnova",
        social_instagram: "https://instagram.com/webnova",
        footer_text: "© 2026 WebNova Studio. All rights reserved.",
      },
    });
    console.log("✔ Default website settings created");
  }

  // 4. Seed Homepage Statistics
  const countStats = await prisma.statistic.count();
  if (countStats === 0) {
    await prisma.statistic.createMany({
      data: [
        { label: "Projects Completed", value: "150", suffix: "+", icon: "🚀", display_order: 1 },
        { label: "Happy Clients", value: "98", suffix: "%", icon: "⭐", display_order: 2 },
        { label: "Years Experience", value: "8", suffix: "+", icon: "🏆", display_order: 3 },
        { label: "Support Available", value: "24/7", suffix: "", icon: "💬", display_order: 4 },
      ],
    });
    console.log("✔ Default statistics created");
  }

  // 5. Seed Pricing Plans
  const countPlans = await prisma.pricingPlan.count();
  if (countPlans === 0) {
    const starterPlan = await prisma.pricingPlan.create({
      data: {
        title: "Starter Launch",
        description: "Essential single-page or landing site to start establishing your online brand.",
        price: 14999,
        billing_cycle: "one-time",
        is_active: true,
        is_popular: false,
        features: {
          create: [
            { feature_name: "1-3 Custom Pages", is_included: true },
            { feature_name: "Responsive Mobile & Desktop Design", is_included: true },
            { feature_name: "Basic SEO & Performance Optimization", is_included: true },
            { feature_name: "Contact & Booking Form", is_included: true },
            { feature_name: "Custom CMS Integration", is_included: false },
          ],
        },
      },
    });

    const businessPlan = await prisma.pricingPlan.create({
      data: {
        title: "Business Growth",
        description: "Full-featured multi-page custom website designed to maximize leads and sales.",
        price: 34999,
        billing_cycle: "one-time",
        is_active: true,
        is_popular: true,
        features: {
          create: [
            { feature_name: "5-10 Custom Pages", is_included: true },
            { feature_name: "Ultra-Fast Performance & Advanced SEO", is_included: true },
            { feature_name: "Admin Content & Lead Management", is_included: true },
            { feature_name: "Interactive Appointment Booking", is_included: true },
            { feature_name: "Nodemailer Automated Email Alerts", is_included: true },
            { feature_name: "Dedicated 30-Day Post Launch Support", is_included: true },
          ],
        },
      },
    });

    const enterprisePlan = await prisma.pricingPlan.create({
      data: {
        title: "Enterprise Custom",
        description: "Tailored web applications, complex integrations, custom workflows, and dedicated support.",
        price: 79999,
        billing_cycle: "one-time",
        is_active: true,
        is_popular: false,
        features: {
          create: [
            { feature_name: "Unlimited Pages & Custom Dynamic Modules", is_included: true },
            { feature_name: "Custom Database & Complex API Integration", is_included: true },
            { feature_name: "Full Admin Dashboard & Analytics", is_included: true },
            { feature_name: "Priority 24/7 VIP Support", is_included: true },
          ],
        },
      },
    });

    console.log("✔ Default pricing plans created");
  }

  // 6. Seed Portfolio Projects
  const countPortfolio = await prisma.portfolio.count();
  if (countPortfolio === 0) {
    await prisma.portfolio.createMany({
      data: [
        {
          title: "Apex Logistics Platform",
          description: "Real-time dispatch, booking, and fleet management web application.",
          category: "Web Application",
          technologies: "React, Node.js, Express, PostgreSQL",
          image_url: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80",
          github_url: "https://github.com/webnova/apex-logistics",
          live_url: "https://apex-logistics.example.com",
          is_featured: true,
        },
        {
          title: "Aura Fintech Dashboard",
          description: "High-volume analytics dashboard for wealth management clients.",
          category: "Dashboard",
          technologies: "React, TypeScript, Chart.js, Prisma",
          image_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
          github_url: "https://github.com/webnova/aura-fintech",
          live_url: "https://aura-fintech.example.com",
          is_featured: true,
        },
        {
          title: "Lumina E-Commerce Portal",
          description: "Headless luxury storefront with customized checkout experience.",
          category: "E-Commerce",
          technologies: "Vite, React, Tailwind, Stripe",
          image_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
          github_url: "https://github.com/webnova/lumina-shop",
          live_url: "https://lumina-store.example.com",
          is_featured: true,
        },
      ],
    });
    console.log("✔ Default portfolio projects created");
  }

  console.log("Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
