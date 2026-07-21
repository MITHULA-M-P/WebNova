const express = require("express");
const { getDashboard } = require("../controllers/admin/dashboardController");
const { getAllBookings, getBookingById, updateBooking, deleteBooking } = require("../controllers/bookingController");
const { getAllSlots, createSlot, updateSlot, deleteSlot } = require("../controllers/slotController");
const { getAllPortfolioAdmin, createPortfolio, updatePortfolio, deletePortfolio } = require("../controllers/portfolioController");
const { getAllPlansAdmin, createPlan, updatePlan, deletePlan } = require("../controllers/planController");
const { getSettings, updateSettings } = require("../controllers/settingsController");
const { getAllStatisticsAdmin, createStatistic, updateStatistic, deleteStatistic } = require("../controllers/statisticController");
const { adminLogin, getMe } = require("../controllers/admin/authController");

const router = express.Router();

// Authentication
router.post("/login", adminLogin);
router.get("/me", getMe);

// Dashboard Overview
router.get("/dashboard", getDashboard);

// Bookings Management
router.get("/bookings", getAllBookings);
router.get("/bookings/:id", getBookingById);
router.put("/bookings/:id", updateBooking);
router.delete("/bookings/:id", deleteBooking);

// Slot Management
router.get("/slots", getAllSlots);
router.post("/slots", createSlot);
router.put("/slots/:id", updateSlot);
router.delete("/slots/:id", deleteSlot);

// Portfolio Management
router.get("/portfolio", getAllPortfolioAdmin);
router.post("/portfolio", createPortfolio);
router.put("/portfolio/:id", updatePortfolio);
router.delete("/portfolio/:id", deletePortfolio);

// Website Plans Management
router.get("/plans", getAllPlansAdmin);
router.post("/plans", createPlan);
router.put("/plans/:id", updatePlan);
router.delete("/plans/:id", deletePlan);

// Website Settings
router.get("/settings", getSettings);
router.put("/settings", updateSettings);

// Statistics Management
router.get("/statistics", getAllStatisticsAdmin);
router.post("/statistics", createStatistic);
router.put("/statistics/:id", updateStatistic);
router.delete("/statistics/:id", deleteStatistic);

module.exports = router;
