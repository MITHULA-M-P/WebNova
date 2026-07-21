const express = require("express");
const { getAvailableSlots } = require("../controllers/slotController");

const router = express.Router();

router.get("/available", getAvailableSlots);

module.exports = router;
