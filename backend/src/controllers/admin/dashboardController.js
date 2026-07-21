const prisma = require('../../config/db');

// GET /api/admin/dashboard
async function getDashboard(req, res, next) {
  try {
    const [totalCustomers, totalPlans, totalBookings] = await Promise.all([
      prisma.customer.count(),
      prisma.websitePlan.count(),
      prisma.booking.count(),
    ]);

    // Placeholder revenue (will be calculated from real data when billing is added)
    const revenue = 0;

    const recentBookings = await prisma.booking.findMany({
      orderBy: { created_at: 'desc' },
      take: 5,
      include: { customer: true },
    });

    const recentPlans = await prisma.websitePlan.findMany({
      orderBy: { created_at: 'desc' },
      take: 5,
      include: { customer: true },
    });

    // Shape data for the frontend
    const bookings = recentBookings.map((b) => ({
      id: b.id,
      customerName: b.customer.business_name || b.customer.email,
      date: b.booking_date,
      time: b.booking_time,
      status: b.status,
    }));

    const plans = recentPlans.map((p) => ({
      id: p.id,
      customerName: p.customer.business_name || p.customer.email,
      websiteType: p.website_type || 'N/A',
      budget: p.budget || 0,
    }));

    res.json({
      totalCustomers,
      totalPlans,
      totalBookings,
      revenue,
      recentBookings: bookings,
      recentPlans: plans,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { getDashboard };

