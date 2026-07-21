const express = require("express");
const { getPublicStatistics } = require("../controllers/statisticController");

const router = express.Router();

router.get("/", getPublicStatistics);

module.exports = router;
