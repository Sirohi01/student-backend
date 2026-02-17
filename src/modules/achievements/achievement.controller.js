const achievementService = require('./achievement.service');
const asyncHandler = require('../../utils/asyncHandler');
const sendResponse = require('../../utils/responseHandler');

exports.getStreak = asyncHandler(async (req, res) => {
    const streak = await achievementService.getStreak(req.user.id);
    sendResponse(res, 200, true, 'Streak fetched successfully', streak);
});

exports.getAchievements = asyncHandler(async (req, res) => {
    const achievements = await achievementService.getUserAchievements(req.user.id);
    sendResponse(res, 200, true, 'Achievements fetched successfully', achievements);
});

exports.getLeaderboard = asyncHandler(async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const leaderboard = await achievementService.getLeaderboard(limit);
    sendResponse(res, 200, true, 'Leaderboard fetched successfully', leaderboard);
});

module.exports = exports;
