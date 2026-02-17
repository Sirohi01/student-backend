const express = require('express');
const aiController = require('./ai.controller');
const { protect } = require('../../middleware/auth');

const router = express.Router();

router.post('/generate-plan', protect, aiController.generatePlan);

module.exports = router;
