const express = require('express');
const achievementController = require('./achievement.controller');
const { protect } = require('../../middleware/auth');

const router = express.Router();

router.get('/streak', protect, achievementController.getStreak);
router.get('/achievements', protect, achievementController.getAchievements);
router.get('/leaderboard', protect, achievementController.getLeaderboard);

module.exports = router;
