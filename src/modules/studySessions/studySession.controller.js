const sessionService = require('./studySession.service');
const asyncHandler = require('../../utils/asyncHandler');
const sendResponse = require('../../utils/responseHandler');
const { logSession } = require('./studySession.validation');
const AppError = require('../../utils/AppError');

exports.logSession = asyncHandler(async (req, res, next) => {
    const { error } = logSession.validate(req.body);
    if (error) return next(new AppError(error.details[0].message, 400));

    const session = await sessionService.logSession(req.user.id, req.body);
    sendResponse(res, 201, true, 'Session logged successfully', session);
});

exports.getSessions = asyncHandler(async (req, res, next) => {
    const sessions = await sessionService.getUserSessions(req.user.id);
    sendResponse(res, 200, true, 'Sessions retrieved successfully', sessions);
});

exports.getStats = asyncHandler(async (req, res, next) => {
    const stats = await sessionService.getSessionStats(req.user.id);
    sendResponse(res, 200, true, 'Stats retrieved successfully', stats);
});
