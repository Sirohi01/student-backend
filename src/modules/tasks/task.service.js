const Task = require('./task.model');
const AppError = require('../../utils/AppError');

exports.createTask = async (userId, data) => {
    const task = await Task.create({
        ...data,
        user: userId,
    });
    return task;
};

exports.getAllTasks = async (userId, query) => {
    let filter = { user: userId };

    if (query.status) {
        filter.status = query.status;
    }

    // Sort by dueDate by default
    return await Task.find(filter).sort({ dueDate: 1 }).populate('subject', 'name color icon');
};

exports.getTaskById = async (userId, taskId) => {
    const task = await Task.findOne({ _id: taskId, user: userId }).populate('subject', 'name color icon');
    if (!task) {
        throw new AppError('Task not found', 404);
    }
    return task;
};

exports.updateTask = async (userId, taskId, data) => {
    const task = await Task.findOneAndUpdate(
        { _id: taskId, user: userId },
        data,
        { new: true, runValidators: true }
    ).populate('subject', 'name color icon');

    if (!task) {
        throw new AppError('Task not found', 404);
    }
    return task;
};

exports.deleteTask = async (userId, taskId) => {
    const task = await Task.findOneAndDelete({ _id: taskId, user: userId });

    if (!task) {
        throw new AppError('Task not found', 404);
    }
    return task;
};

exports.getTasksBySubject = async (userId, subjectId) => {
    return await Task.find({ user: userId, subject: subjectId }).sort({ dueDate: 1 });
};
