const express = require('express');
const sessionController = require('./studySession.controller');
const { protect } = require('../../middleware/auth');

const router = express.Router();

router.use(protect);

router
    .route('/')
    .get(sessionController.getSessions)
    .post(sessionController.logSession);

router.get('/stats', sessionController.getStats);

module.exports = router;
