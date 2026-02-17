const express = require('express');
const authController = require('./auth.controller');
const { protect } = require('../../middleware/auth');

const router = express.Router();

router.post('/register', (req, res, next) => {
    console.log('Hitting /register route');
    authController.register(req, res, next);
});
router.post('/login', authController.login);
router.get('/me', protect, authController.getMe);
router.post('/update-api-key', protect, authController.updateApiKey);

module.exports = router;
