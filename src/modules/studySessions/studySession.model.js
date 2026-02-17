const mongoose = require('mongoose');

const studySessionSchema = new mongoose.Schema({
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
    task: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
    },
    startTime: {
        type: Date,
        required: true,
    },
    endTime: {
        type: Date,
    },
    duration: {
        type: Number, // in minutes
        required: true,
    },
    focusScore: {
        type: Number,
        min: 0,
        max: 100,
        default: 100,
    },
    notes: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const StudySession = mongoose.model('StudySession', studySessionSchema);

module.exports = StudySession;
