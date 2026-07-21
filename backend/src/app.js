require("dotenv").config();

const express = require("express");
const cors = require("cors");
const prisma = require("./config/db");

const plannerRoutes = require("./routes/plannerRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const templateRoutes = require("./routes/templateRoutes");
const slotRoutes = require("./routes/slotRoutes");
const portfolioRoutes = require("./routes/portfolioRoutes");
const planRoutes = require("./routes/planRoutes");
const settingsRoutes = require("./routes/settingsRoutes");
const statisticRoutes = require("./routes/statisticRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health / Test Route
app.get("/", async (req, res) => {
  try {
    await prisma.$connect();
    res.send("Connected to WebNova PostgreSQL API successfully!");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// API Routes
app.use("/api/planner", plannerRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/templates", templateRoutes);
app.use("/api/slots", slotRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/statistics", statisticRoutes);
app.use("/api/admin", adminRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("API Error:", err);
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  });
});

module.exports = app;