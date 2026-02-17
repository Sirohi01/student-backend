const asyncHandler = require('../../utils/asyncHandler');
const flashcardService = require('./flashcard.service');
const sendResponse = require('../../utils/responseHandler');

const createFlashcard = asyncHandler(async (req, res) => {
    const flashcard = await flashcardService.createFlashcard(req.user.id, req.body);
    sendResponse(res, 201, true, 'Flashcard created successfully', flashcard);
});

const getDueFlashcards = asyncHandler(async (req, res) => {
    const flashcards = await flashcardService.getDueFlashcards(req.user.id);
    sendResponse(res, 200, true, 'Due flashcards fetched successfully', flashcards);
});

const reviewFlashcard = asyncHandler(async (req, res) => {
    // expects params: id, body: { quality: 0-5 }
    const { quality } = req.body;
    if (quality === undefined || quality < 0 || quality > 5) {
        return sendResponse(res, 400, false, 'Quality must be between 0 and 5');
    }
    const flashcard = await flashcardService.processReview(req.user.id, req.params.id, quality);
    sendResponse(res, 200, true, 'Flashcard reviewed successfully', flashcard);
});

const getFlashcardsBySubject = asyncHandler(async (req, res) => {
    const { subjectId } = req.params;
    const flashcards = await flashcardService.getFlashcardsBySubject(req.user.id, subjectId);
    sendResponse(res, 200, true, 'Flashcards fetched successfully', flashcards);
});

module.exports = {
    createFlashcard,
    getDueFlashcards,
    reviewFlashcard,
    getFlashcardsBySubject
};
