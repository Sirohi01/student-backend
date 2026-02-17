const Note = require('./note.model');

exports.createNote = async (userId, data) => {
    return await Note.create({ ...data, user: userId });
};

exports.getUserNotes = async (userId, filters = {}) => {
    const query = { user: userId };

    if (filters.subject) query.subject = filters.subject;
    if (filters.isPinned !== undefined) query.isPinned = filters.isPinned;
    if (filters.tags && filters.tags.length > 0) query.tags = { $in: filters.tags };

    return await Note.find(query)
        .sort({ isPinned: -1, updatedAt: -1 })
        .populate('subject', 'name color icon');
};

exports.getNoteById = async (userId, noteId) => {
    return await Note.findOne({ _id: noteId, user: userId })
        .populate('subject', 'name color icon');
};

exports.updateNote = async (userId, noteId, data) => {
    return await Note.findOneAndUpdate(
        { _id: noteId, user: userId },
        data,
        { new: true, runValidators: true }
    ).populate('subject', 'name color icon');
};

exports.deleteNote = async (userId, noteId) => {
    return await Note.findOneAndDelete({ _id: noteId, user: userId });
};

exports.searchNotes = async (userId, searchTerm) => {
    return await Note.find({
        user: userId,
        $text: { $search: searchTerm }
    })
        .sort({ score: { $meta: 'textScore' } })
        .populate('subject', 'name color icon');
};

exports.togglePin = async (userId, noteId) => {
    const note = await Note.findOne({ _id: noteId, user: userId });
    if (!note) return null;

    note.isPinned = !note.isPinned;
    await note.save();
    return note;
};

module.exports = exports;
