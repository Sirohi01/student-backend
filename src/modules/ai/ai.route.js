const express = require('express');
const aiController = require('./ai.controller');
const { protect } = require('../../middleware/auth');

const router = express.Router();

router.post('/generate-plan', protect, aiController.generatePlan);
router.post('/generate-flashcards', protect, aiController.generateFlashcards);

module.exports = router;
