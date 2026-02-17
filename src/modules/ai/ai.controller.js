const aiService = require('./ai.service');
const asyncHandler = require('../../utils/asyncHandler');
const sendResponse = require('../../utils/responseHandler');

exports.generatePlan = asyncHandler(async (req, res, next) => {
    const { subjects, examDate, availableHours } = req.body;

    if (!subjects || !examDate || !availableHours) {
        return sendResponse(res, 400, false, 'Please provide subjects, examDate, and availableHours');
    }

    const plan = await aiService.generateStudyPlan(subjects, examDate, availableHours);

    sendResponse(res, 200, true, 'Study plan generated successfully', plan);
});
