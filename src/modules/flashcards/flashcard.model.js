const mongoose = require('mongoose');

const flashcardSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        subject: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Subject',
            required: true,
        },
        front: {
            type: String,
            required: [true, 'Flashcard must have a front question'],
            trim: true,
        },
        back: {
            type: String,
            required: [true, 'Flashcard must have a back answer'],
            trim: true,
        },
        box: {
            type: Number,
            default: 1, // Start at box 1
        },
        nextReviewDate: {
            type: Date,
            default: Date.now,
        },
        interval: {
            type: Number,
            default: 0, // days
        },
        easeFactor: {
            type: Number,
            default: 2.5,
        },
        repetitions: {
            type: Number,
            default: 0,
        }
    },
    {
        timestamps: true,
    }
);

// Method to schedule next review based on user rating (SuperMemo-2 inspired)
flashcardSchema.methods.scheduleReview = function (quality) {
    // quality: 0-5. (0=blackout, 3=pass, 5=perfect)
    // We map frontend "Hard", "Good", "Easy" to these values.
    // Hard = 3, Good = 4, Easy = 5. Fail = 0-2 (not implemented yet in UI)

    if (quality >= 3) {
        if (this.repetitions === 0) {
            this.interval = 1;
        } else if (this.repetitions === 1) {
            this.interval = 6;
        } else {
            this.interval = Math.round(this.interval * this.easeFactor);
        }
        this.repetitions += 1;
    } else {
        this.repetitions = 0;
        this.interval = 1;
    }

    this.easeFactor = this.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    if (this.easeFactor < 1.3) this.easeFactor = 1.3;

    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + this.interval);
    this.nextReviewDate = nextDate;

    return this.save();
};

const Flashcard = mongoose.model('Flashcard', flashcardSchema);

module.exports = Flashcard;
