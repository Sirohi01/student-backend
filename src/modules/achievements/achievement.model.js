const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    type: {
        type: String,
        enum: [
            'first_session',
            'streak_7',
            'streak_30',
            'streak_100',
            'hours_10',
            'hours_50',
            'hours_100',
            'flashcards_100',
            'flashcards_500',
            'perfect_focus',
            'early_bird',
            'night_owl',
            'task_master',
        ],
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    icon: {
        type: String,
        default: '🏆',
    },
    unlockedAt: {
        type: Date,
        default: Date.now,
    },
});

const streakSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    currentStreak: {
        type: Number,
        default: 0,
    },
    longestStreak: {
        type: Number,
        default: 0,
    },
    lastStudyDate: {
        type: Date,
    },
    totalStudyDays: {
        type: Number,
        default: 0,
    },
    totalHours: {
        type: Number,
        default: 0,
    },
});

const Achievement = mongoose.model('Achievement', achievementSchema);
const Streak = mongoose.model('Streak', streakSchema);

module.exports = { Achievement, Streak };
