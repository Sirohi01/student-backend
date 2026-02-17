const express = require('express');
const router = express.Router();
const flashcardController = require('./flashcard.controller');
const { protect } = require('../../middleware/auth');

router.use(protect); // All routes protected

router.route('/')
    .post(flashcardController.createFlashcard);

router.get('/due', flashcardController.getDueFlashcards);

router.post('/:id/review', flashcardController.reviewFlashcard);

router.get('/subject/:subjectId', flashcardController.getFlashcardsBySubject);

module.exports = router;
