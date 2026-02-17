const Goal = require('./goal.model');

exports.createGoal = async (userId, data) => {
    return await Goal.create({ ...data, user: userId });
};

exports.getUserGoals = async (userId, filters = {}) => {
    const query = { user: userId };

    if (filters.type) query.type = filters.type;
    if (filters.isCompleted !== undefined) query.isCompleted = filters.isCompleted;

    // Active goals (not expired)
    if (filters.active) {
        query.endDate = { $gte: new Date() };
        query.isCompleted = false;
    }

    return await Goal.find(query).sort({ createdAt: -1 });
};

exports.getGoalById = async (userId, goalId) => {
    return await Goal.findOne({ _id: goalId, user: userId });
};

exports.updateGoal = async (userId, goalId, data) => {
    return await Goal.findOneAndUpdate(
        { _id: goalId, user: userId },
        data,
        { new: true, runValidators: true }
    );
};

exports.deleteGoal = async (userId, goalId) => {
    return await Goal.findOneAndDelete({ _id: goalId, user: userId });
};

exports.updateGoalProgress = async (userId, goalId, value) => {
    const goal = await Goal.findOne({ _id: goalId, user: userId });
    if (!goal) return null;

    return await goal.updateProgress(value);
};

// Auto-update goals based on activity
exports.updateGoalsOnActivity = async (userId, activityType, value) => {
    const activeGoals = await Goal.find({
        user: userId,
        targetType: activityType,
        isCompleted: false,
        endDate: { $gte: new Date() },
    });

    const updates = [];
    for (const goal of activeGoals) {
        updates.push(goal.updateProgress(value));
    }

    return await Promise.all(updates);
};

module.exports = exports;
