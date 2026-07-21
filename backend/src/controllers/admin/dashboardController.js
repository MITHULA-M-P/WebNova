const prisma = require("../../config/db");

// GET /api/admin/dashboard
async function getDashboard(req, res, next) {
  try {
    const todayStr = new Date().toISOString().split("T")[0];

    const [
      totalBookings,
      pendingBookings,
      confirmedBookings,
      cancelledBookings,
      projectsCompleted,
      totalSlots,
      allBookings,
      recentBookings,
    ] = await Promise.all([
      prisma.booking.count(),
      prisma.booking.count({ where: { status: "pending" } }),
      prisma.booking.count({ where: { status: "confirmed" } }),
      prisma.booking.count({ where: { status: "cancelled" } }),
      prisma.portfolio.count(),
      prisma.timeSlot.count({ where: { is_active: true } }),
      prisma.booking.findMany({ select: { created_at: true, status: true, booking_date: true } }),
      prisma.booking.findMany({
        orderBy: { created_at: "desc" },
        take: 6,
        include: { customer: true },
      }),
    ]);

    // Calculate booked slots for today
    const bookedTodayCount = await prisma.booking.count({
      where: {
        booking_date: todayStr,
        status: { in: ["confirmed", "pending"] },
      },
    });
    const availableSlotsToday = Math.max(0, totalSlots - bookedTodayCount);

    // Formulate Booking Trends (Last 7 Days)
    const days = [];
    const trendMap = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const dayLabel = d.toLocaleDateString("en-US", { weekday: "short" });
      days.push(dayLabel);
      trendMap[dateStr] = 0;
    }

    allBookings.forEach((b) => {
      const dateStr = new Date(b.created_at).toISOString().split("T")[0];
      if (trendMap[dateStr] !== undefined) {
        trendMap[dateStr] += 1;
      }
    });

    const bookingTrends = {
      labels: days,
      data: Object.values(trendMap),
    };

    // Booking Status Distribution
    const statusDistribution = [
      { status: "Confirmed", count: confirmedBookings, color: "#10b981" },
      { status: "Pending", count: pendingBookings, color: "#f59e0b" },
      { status: "Cancelled", count: cancelledBookings, color: "#ef4444" },
    ];

    // Monthly Project Statistics (Mock/Derived from Portfolios)
    const monthlyProjects = {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
      completed: [4, 6, 8, 5, 9, 12, projectsCompleted],
    };

    // Formatted recent bookings
    const formattedRecent = recentBookings.map((b) => ({
      id: b.id,
      customerName: b.customer?.business_name || b.customer?.email || "Unknown Client",
      email: b.customer?.email || "",
      phone: b.customer?.phone || "",
      date: b.booking_date,
      time: b.booking_time,
      status: b.status,
      message: b.message || "",
    }));

    res.json({
      summary: {
        totalBookings,
        pendingBookings,
        confirmedBookings,
        cancelledBookings,
        projectsCompleted,
        availableSlotsToday,
      },
      charts: {
        bookingTrends,
        statusDistribution,
        monthlyProjects,
      },
      recentBookings: formattedRecent,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { getDashboard };
