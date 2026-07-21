require("dotenv").config();

const express = require("express");
const cors = require("cors");
const prisma = require("./config/db");

const plannerRoutes = require("./routes/plannerRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const templateRoutes = require("./routes/templateRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test Route
app.get("/", async (req, res) => {
  try {
    await prisma.$connect();
    res.send("Connected to PostgreSQL successfully!");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

const adminRoutes = require('./routes/adminRoutes');

// API Routes
app.use("/api/planner", plannerRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/templates", templateRoutes);
app.use('/api/admin', adminRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

module.exports = app;