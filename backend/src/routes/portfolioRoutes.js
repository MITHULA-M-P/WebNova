const express = require("express");
const { getPublicPortfolio } = require("../controllers/portfolioController");

const router = express.Router();

router.get("/", getPublicPortfolio);

module.exports = router;
