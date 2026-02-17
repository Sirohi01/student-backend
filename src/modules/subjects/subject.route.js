const express = require('express');
const subjectController = require('./subject.controller');
const { protect } = require('../../middleware/auth');

const router = express.Router();

router.use(protect); // Protect all routes

router
    .route('/')
    .get(subjectController.getAllSubjects)
    .post(subjectController.createSubject);

router
    .route('/:id')
    .get(subjectController.getSubject)
    .patch(subjectController.updateSubject)
    .delete(subjectController.deleteSubject);

module.exports = router;
