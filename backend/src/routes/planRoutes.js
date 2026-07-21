const express = require("express");
const { getPublicPlans } = require("../controllers/planController");

const router = express.Router();

router.get("/", getPublicPlans);

module.exports = router;
