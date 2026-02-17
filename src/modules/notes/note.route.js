const express = require('express');
const noteController = require('./note.controller');
const { protect } = require('../../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
    .get(noteController.getNotes)
    .post(noteController.createNote);

router.get('/search', noteController.searchNotes);

router.route('/:id')
    .get(noteController.getNote)
    .patch(noteController.updateNote)
    .delete(noteController.deleteNote);

router.patch('/:id/pin', noteController.togglePin);

module.exports = router;
