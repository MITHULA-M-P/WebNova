const express = require('express');
const { getDashboard } = require('../controllers/admin/dashboardController');

const router = express.Router();

router.get('/dashboard', getDashboard);

module.exports = router;
