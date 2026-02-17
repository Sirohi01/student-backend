const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a subject name'],
        trim: true,
    },
    color: {
        type: String,
        default: '#6366f1', // Default Indigo
    },
    icon: {
        type: String,
        default: 'BookOpen',
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Ensure unique subject names per user
subjectSchema.index({ user: 1, name: 1 }, { unique: true });

const Subject = mongoose.model('Subject', subjectSchema);

module.exports = Subject;
