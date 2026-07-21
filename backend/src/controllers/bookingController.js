const { z } = require("zod");
const prisma = require("../config/db");
const { sendBookingConfirmationEmail, sendBookingStatusUpdateEmail } = require("../services/emailService");

// Zod validation schemas
const createBookingSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time slot is required"),
  message: z.string().optional().nullable(),
});

const updateBookingSchema = z.object({
  date: z.string().optional(),
  time: z.string().optional(),
  status: z.enum(["pending", "confirmed", "cancelled"]).optional(),
  message: z.string().optional().nullable(),
});

// POST /api/bookings
async function createBooking(req, res, next) {
  try {
    const data = req.validatedBody || req.body;

    // 1. Check if the chosen date & time is already booked and confirmed
    const existingConflict = await prisma.booking.findFirst({
      where: {
        booking_date: data.date,
        booking_time: data.time,
        status: { in: ["confirmed", "pending"] },
      },
    });

    if (existingConflict) {
      return res.status(400).json({
        error: "Selected time slot is already booked for this date. Please select another slot.",
      });
    }

    // 2. Find or create customer
    const customer = await prisma.customer.upsert({
      where: { email: data.email },
      update: {
        phone: data.phone,
        business_name: data.name,
      },
      create: {
        email: data.email,
        phone: data.phone,
        business_name: data.name,
      },
    });

    // 3. Create Booking
    const booking = await prisma.booking.create({
      data: {
        customer_id: customer.id,
        booking_date: data.date,
        booking_time: data.time,
        status: "pending",
        message: data.message || null,
      },
      include: {
        customer: true,
      },
    });

    // 4. Send email notification asynchronously
    sendBookingConfirmationEmail(booking).catch((err) =>
      console.error("Failed to send booking notification email:", err)
    );

    return res.status(201).json(booking);
  } catch (error) {
    next(error);
  }
}

// GET /api/bookings (Search, Filter, Pagination, Sorting)
async function getAllBookings(req, res, next) {
  try {
    const {
      search = "",
      status = "",
      date = "",
      page = "1",
      limit = "10",
      sortBy = "created_at",
      sortOrder = "desc",
    } = req.query;

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    // Build Prisma query filters
    const where = {};

    if (status && status !== "all") {
      where.status = status;
    }

    if (date) {
      where.booking_date = date;
    }

    if (search) {
      where.customer = {
        OR: [
          { business_name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
          { phone: { contains: search, mode: "insensitive" } },
        ],
      };
    }

    const [total, bookings] = await Promise.all([
      prisma.booking.count({ where }),
      prisma.booking.findMany({
        where,
        include: {
          customer: true,
        },
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip,
        take: limitNum,
      }),
    ]);

    return res.json({
      data: bookings.map((b) => ({
        id: b.id,
        customerId: b.customer_id,
        customerName: b.customer?.business_name || "N/A",
        email: b.customer?.email || "",
        phone: b.customer?.phone || "",
        date: b.booking_date,
        time: b.booking_time,
        status: b.status,
        message: b.message,
        createdAt: b.created_at,
      })),
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum) || 1,
      },
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/bookings/:id
async function getBookingById(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid booking ID" });
    }

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        customer: true,
      },
    });

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    return res.json({
      id: booking.id,
      customerId: booking.customer_id,
      customerName: booking.customer?.business_name || "N/A",
      email: booking.customer?.email || "",
      phone: booking.customer?.phone || "",
      date: booking.booking_date,
      time: booking.booking_time,
      status: booking.status,
      message: booking.message,
      createdAt: booking.created_at,
    });
  } catch (error) {
    next(error);
  }
}

// PUT /api/bookings/:id
async function updateBooking(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid booking ID" });
    }

    const data = req.validatedBody || req.body;

    const existingBooking = await prisma.booking.findUnique({
      where: { id },
      include: { customer: true },
    });

    if (!existingBooking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    const isDateOrTimeChanged =
      (data.date && data.date !== existingBooking.booking_date) ||
      (data.time && data.time !== existingBooking.booking_time);

    const isStatusChanged = data.status && data.status !== existingBooking.status;

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: {
        booking_date: data.date !== undefined ? data.date : existingBooking.booking_date,
        booking_time: data.time !== undefined ? data.time : existingBooking.booking_time,
        status: data.status !== undefined ? data.status : existingBooking.status,
        message: data.message !== undefined ? data.message : existingBooking.message,
      },
      include: {
        customer: true,
      },
    });

    // Send email notification on status change or reschedule
    if (isStatusChanged || isDateOrTimeChanged) {
      const actionType = isDateOrTimeChanged
        ? "rescheduled"
        : updatedBooking.status === "confirmed"
        ? "confirmed"
        : updatedBooking.status === "cancelled"
        ? "cancelled"
        : "update";

      sendBookingStatusUpdateEmail(updatedBooking, actionType).catch((err) =>
        console.error("Failed to send status update email:", err)
      );
    }

    return res.json({
      id: updatedBooking.id,
      customerId: updatedBooking.customer_id,
      customerName: updatedBooking.customer?.business_name || "N/A",
      email: updatedBooking.customer?.email || "",
      phone: updatedBooking.customer?.phone || "",
      date: updatedBooking.booking_date,
      time: updatedBooking.booking_time,
      status: updatedBooking.status,
      message: updatedBooking.message,
      createdAt: updatedBooking.created_at,
    });
  } catch (error) {
    next(error);
  }
}

// DELETE /api/bookings/:id
async function deleteBooking(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid booking ID" });
    }

    const existingBooking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!existingBooking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    await prisma.booking.delete({
      where: { id },
    });

    return res.json({ success: true, message: "Booking deleted successfully" });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createBookingSchema,
  updateBookingSchema,
  createBooking,
  getAllBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
};
