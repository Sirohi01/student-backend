const goalService = require('./goal.service');
const asyncHandler = require('../../utils/asyncHandler');
const sendResponse = require('../../utils/responseHandler');

exports.createGoal = asyncHandler(async (req, res) => {
    const goal = await goalService.createGoal(req.user.id, req.body);
    sendResponse(res, 201, true, 'Goal created successfully', goal);
});

exports.getGoals = asyncHandler(async (req, res) => {
    const filters = {
        type: req.query.type,
        isCompleted: req.query.isCompleted,
        active: req.query.active === 'true',
    };

    const goals = await goalService.getUserGoals(req.user.id, filters);
    sendResponse(res, 200, true, 'Goals fetched successfully', goals);
});

exports.getGoal = asyncHandler(async (req, res) => {
    const goal = await goalService.getGoalById(req.user.id, req.params.id);

    if (!goal) {
        return sendResponse(res, 404, false, 'Goal not found');
    }

    sendResponse(res, 200, true, 'Goal fetched successfully', goal);
});

exports.updateGoal = asyncHandler(async (req, res) => {
    const goal = await goalService.updateGoal(req.user.id, req.params.id, req.body);

    if (!goal) {
        return sendResponse(res, 404, false, 'Goal not found');
    }

    sendResponse(res, 200, true, 'Goal updated successfully', goal);
});

exports.deleteGoal = asyncHandler(async (req, res) => {
    const goal = await goalService.deleteGoal(req.user.id, req.params.id);

    if (!goal) {
        return sendResponse(res, 404, false, 'Goal not found');
    }

    sendResponse(res, 200, true, 'Goal deleted successfully');
});

module.exports = exports;
