const express = require('express');
const goalController = require('./goal.controller');
const { protect } = require('../../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
    .get(goalController.getGoals)
    .post(goalController.createGoal);

router.route('/:id')
    .get(goalController.getGoal)
    .patch(goalController.updateGoal)
    .delete(goalController.deleteGoal);

module.exports = router;
