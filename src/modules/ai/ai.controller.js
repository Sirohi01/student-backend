const aiService = require('./ai.service');
const asyncHandler = require('../../utils/asyncHandler');
const sendResponse = require('../../utils/responseHandler');
const User = require('../auth/auth.model');

exports.generatePlan = asyncHandler(async (req, res, next) => {
    const { subjects, examDate, availableHours } = req.body;

    if (!subjects || !examDate || !availableHours) {
        return sendResponse(res, 400, false, 'Please provide subjects, examDate, and availableHours');
    }

    const plan = await aiService.generateStudyPlan(subjects, examDate, availableHours);

    sendResponse(res, 200, true, 'Study plan generated successfully', plan);
});

exports.generateFlashcards = asyncHandler(async (req, res, next) => {
    const { subject, topic, count } = req.body;

    if (!subject || !topic) {
        return sendResponse(res, 400, false, 'Please provide subject and topic');
    }

    // Get user's API key
    const user = await User.findById(req.user.id).select('+openaiApiKey');
    const apiKey = user?.openaiApiKey || process.env.OPENAI_API_KEY;

    const flashcards = await aiService.generateFlashcards(subject, topic, count || 5, apiKey);

    sendResponse(res, 200, true, 'Flashcards generated successfully', flashcards);
});
