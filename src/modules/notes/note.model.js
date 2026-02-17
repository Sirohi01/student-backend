const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
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
    title: {
        type: String,
        required: [true, 'Note must have a title'],
        trim: true,
    },
    content: {
        type: String,
        required: [true, 'Note must have content'],
    },
    tags: [{
        type: String,
        trim: true,
    }],
    isPinned: {
        type: Boolean,
        default: false,
    },
    color: {
        type: String,
        default: '#6366f1',
    },
    attachments: [{
        name: String,
        url: String,
        type: String,
        size: Number,
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

noteSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

noteSchema.index({ user: 1, subject: 1 });
noteSchema.index({ title: 'text', content: 'text', tags: 'text' });

const Note = mongoose.model('Note', noteSchema);

module.exports = Note;
