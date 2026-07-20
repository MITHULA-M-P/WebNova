const express = require("express");
const {
  getTemplates,
  getPortfolio,
  getReviews,
} = require("../controllers/templateController");

const router = express.Router();

router.get("/templates", getTemplates);
router.get("/portfolio", getPortfolio);
router.get("/reviews", getReviews);

module.exports = router;
