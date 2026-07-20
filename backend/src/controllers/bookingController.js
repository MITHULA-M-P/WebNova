const { z } = require("zod");
const prisma = require("../config/db");

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
    const data = req.validatedBody;

    // 1. Find or create customer
    const customer = await prisma.customer.upsert({
  where: {
    email: data.email,
  },
  update: {
    phone: data.phone,
  },
  create: {
    email: data.email,
    phone: data.phone,
    business_name: data.name,
  },
});
    // 2. Create Booking
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

    return res.status(201).json(booking);
  } catch (error) {
    next(error);
  }
}

// GET /api/bookings
async function getAllBookings(req, res, next) {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        customer: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });
    return res.json(bookings);
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

    return res.json(booking);
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

    const data = req.validatedBody;

    const existingBooking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!existingBooking) {
      return res.status(404).json({ error: "Booking not found" });
    }

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

    return res.json(updatedBooking);
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

    return res.json({ message: "Booking deleted successfully" });
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
