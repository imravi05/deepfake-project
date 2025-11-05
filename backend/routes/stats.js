// File: backend/routes/stats.js

const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');

// @route   GET /api/stats
router.get('/', statsController.getStats);

module.exports = router;