const noteService = require('./note.service');
const asyncHandler = require('../../utils/asyncHandler');
const sendResponse = require('../../utils/responseHandler');

exports.createNote = asyncHandler(async (req, res) => {
    const note = await noteService.createNote(req.user.id, req.body);
    sendResponse(res, 201, true, 'Note created successfully', note);
});

exports.getNotes = asyncHandler(async (req, res) => {
    const filters = {
        subject: req.query.subject,
        isPinned: req.query.isPinned,
        tags: req.query.tags ? req.query.tags.split(',') : undefined,
    };

    const notes = await noteService.getUserNotes(req.user.id, filters);
    sendResponse(res, 200, true, 'Notes fetched successfully', notes);
});

exports.getNote = asyncHandler(async (req, res) => {
    const note = await noteService.getNoteById(req.user.id, req.params.id);

    if (!note) {
        return sendResponse(res, 404, false, 'Note not found');
    }

    sendResponse(res, 200, true, 'Note fetched successfully', note);
});

exports.updateNote = asyncHandler(async (req, res) => {
    const note = await noteService.updateNote(req.user.id, req.params.id, req.body);

    if (!note) {
        return sendResponse(res, 404, false, 'Note not found');
    }

    sendResponse(res, 200, true, 'Note updated successfully', note);
});

exports.deleteNote = asyncHandler(async (req, res) => {
    const note = await noteService.deleteNote(req.user.id, req.params.id);

    if (!note) {
        return sendResponse(res, 404, false, 'Note not found');
    }

    sendResponse(res, 200, true, 'Note deleted successfully');
});

exports.searchNotes = asyncHandler(async (req, res) => {
    const { q } = req.query;

    if (!q) {
        return sendResponse(res, 400, false, 'Search query is required');
    }

    const notes = await noteService.searchNotes(req.user.id, q);
    sendResponse(res, 200, true, 'Search results', notes);
});

exports.togglePin = asyncHandler(async (req, res) => {
    const note = await noteService.togglePin(req.user.id, req.params.id);

    if (!note) {
        return sendResponse(res, 404, false, 'Note not found');
    }

    sendResponse(res, 200, true, 'Note pin toggled', note);
});

module.exports = exports;
