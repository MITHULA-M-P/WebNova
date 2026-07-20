const express = require("express");
const { validateBody } = require("../middleware/validate");
const {
  createBookingSchema,
  updateBookingSchema,
  createBooking,
  getAllBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
} = require("../controllers/bookingController");

const router = express.Router();

router.post("/", validateBody(createBookingSchema), createBooking);
router.get("/", getAllBookings);
router.get("/:id", getBookingById);
router.put("/:id", validateBody(updateBookingSchema), updateBooking);
router.delete("/:id", deleteBooking);

module.exports = router;
