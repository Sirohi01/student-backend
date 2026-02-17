const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    type: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'custom'],
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: String,
    targetType: {
        type: String,
        enum: ['hours', 'sessions', 'tasks', 'flashcards'],
        required: true,
    },
    targetValue: {
        type: Number,
        required: true,
    },
    currentValue: {
        type: Number,
        default: 0,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    isCompleted: {
        type: Boolean,
        default: false,
    },
    completedAt: Date,
    reward: {
        xp: { type: Number, default: 0 },
        badge: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

goalSchema.methods.updateProgress = function (value) {
    this.currentValue += value;

    if (this.currentValue >= this.targetValue && !this.isCompleted) {
        this.isCompleted = true;
        this.completedAt = new Date();
    }

    return this.save();
};

goalSchema.methods.getProgress = function () {
    return Math.min(Math.round((this.currentValue / this.targetValue) * 100), 100);
};

const Goal = mongoose.model('Goal', goalSchema);

module.exports = Goal;
