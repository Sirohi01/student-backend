const Flashcard = require('./flashcard.model');
const Subject = require('../subjects/subject.model');

const createFlashcard = async (userId, data) => {
    const { subjectId, front, back } = data;

    // Verify subject ownership
    const subject = await Subject.findOne({ _id: subjectId, user: userId });
    if (!subject) {
        throw new Error('Subject not found or unauthorized');
    }

    const flashcard = await Flashcard.create({
        user: userId,
        subject: subjectId,
        front,
        back
    });

    return flashcard;
};

const getDueFlashcards = async (userId) => {
    const now = new Date();
    // Fetch cards where nextReviewDate <= now
    const dueCards = await Flashcard.find({
        user: userId,
        nextReviewDate: { $lte: now }
    })
        .populate('subject', 'name color')
        .sort({ nextReviewDate: 1 })
        .limit(20); // Limit daily review session size

    return dueCards;
};

const processReview = async (userId, cardId, quality) => {
    const card = await Flashcard.findOne({ _id: cardId, user: userId });

    if (!card) {
        throw new Error('Flashcard not found');
    }

    // Create review log (optional, for analytics)
    // For now, update card directly using model logic

    // Use model method for consistency
    const updatedCard = await card.scheduleReview(quality);
    return updatedCard;
};

const getFlashcardsBySubject = async (userId, subjectId) => {
    return await Flashcard.find({ user: userId, subject: subjectId });
};

module.exports = {
    createFlashcard,
    getDueFlashcards,
    processReview,
    getFlashcardsBySubject
};
