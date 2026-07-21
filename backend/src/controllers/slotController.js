const prisma = require("../config/db");

// GET /api/slots/available?date=YYYY-MM-DD
async function getAvailableSlots(req, res, next) {
  try {
    const { date } = req.query;

    // Fetch all active slots
    const slots = await prisma.timeSlot.findMany({
      where: { is_active: true },
      orderBy: { id: "asc" },
    });

    if (!date) {
      return res.json(
        slots.map((s) => ({
          id: s.id,
          startTime: s.start_time,
          endTime: s.end_time,
          display: `${s.start_time} - ${s.end_time}`,
          time: s.start_time,
          available: true,
        }))
      );
    }

    // Fetch all confirmed or pending bookings for this date
    const bookedForDate = await prisma.booking.findMany({
      where: {
        booking_date: date,
        status: { in: ["confirmed", "pending"] },
      },
      select: { booking_time: true },
    });

    const bookedTimesSet = new Set(bookedForDate.map((b) => b.booking_time));

    const result = slots.map((s) => {
      const isBooked = bookedTimesSet.has(s.start_time) || bookedTimesSet.has(`${s.start_time} - ${s.end_time}`);
      return {
        id: s.id,
        startTime: s.start_time,
        endTime: s.end_time,
        time: s.start_time,
        display: `${s.start_time} - ${s.end_time}`,
        available: !isBooked,
      };
    });

    return res.json(result);
  } catch (error) {
    next(error);
  }
}

// GET /api/admin/slots (Admin fetch all slots)
async function getAllSlots(req, res, next) {
  try {
    const slots = await prisma.timeSlot.findMany({
      orderBy: { id: "asc" },
    });
    return res.json(slots);
  } catch (error) {
    next(error);
  }
}

// POST /api/admin/slots (Admin add new slot)
async function createSlot(req, res, next) {
  try {
    const { day_of_week = "all", start_time, end_time, is_active = true } = req.body;

    if (!start_time || !end_time) {
      return res.status(400).json({ error: "Start time and End time are required" });
    }

    const newSlot = await prisma.timeSlot.create({
      data: {
        day_of_week,
        start_time,
        end_time,
        is_active: Boolean(is_active),
      },
    });

    return res.status(201).json(newSlot);
  } catch (error) {
    next(error);
  }
}

// PUT /api/admin/slots/:id (Admin edit / toggle slot)
async function updateSlot(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid slot ID" });

    const { day_of_week, start_time, end_time, is_active } = req.body;

    const slot = await prisma.timeSlot.update({
      where: { id },
      data: {
        ...(day_of_week !== undefined && { day_of_week }),
        ...(start_time !== undefined && { start_time }),
        ...(end_time !== undefined && { end_time }),
        ...(is_active !== undefined && { is_active: Boolean(is_active) }),
      },
    });

    return res.json(slot);
  } catch (error) {
    next(error);
  }
}

// DELETE /api/admin/slots/:id (Admin delete slot)
async function deleteSlot(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid slot ID" });

    await prisma.timeSlot.delete({ where: { id } });
    return res.json({ success: true, message: "Slot deleted" });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAvailableSlots,
  getAllSlots,
  createSlot,
  updateSlot,
  deleteSlot,
};
