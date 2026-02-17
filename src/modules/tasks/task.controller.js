const taskService = require('./task.service');
const asyncHandler = require('../../utils/asyncHandler');
const sendResponse = require('../../utils/responseHandler');
const { createTask, updateTask } = require('./task.validation');
const AppError = require('../../utils/AppError');

exports.createTask = asyncHandler(async (req, res, next) => {
    const { error } = createTask.validate(req.body);
    if (error) return next(new AppError(error.details[0].message, 400));

    const task = await taskService.createTask(req.user.id, req.body);
    sendResponse(res, 201, true, 'Task created successfully', task);
});

exports.getAllTasks = asyncHandler(async (req, res, next) => {
    const tasks = await taskService.getAllTasks(req.user.id, req.query);
    sendResponse(res, 200, true, 'Tasks retrieved successfully', tasks);
});

exports.getTask = asyncHandler(async (req, res, next) => {
    const task = await taskService.getTaskById(req.user.id, req.params.id);
    sendResponse(res, 200, true, 'Task retrieved successfully', task);
});

exports.updateTask = asyncHandler(async (req, res, next) => {
    const { error } = updateTask.validate(req.body);
    if (error) return next(new AppError(error.details[0].message, 400));

    const task = await taskService.updateTask(req.user.id, req.params.id, req.body);
    sendResponse(res, 200, true, 'Task updated successfully', task);
});

exports.deleteTask = asyncHandler(async (req, res, next) => {
    await taskService.deleteTask(req.user.id, req.params.id);
    sendResponse(res, 200, true, 'Task deleted successfully');
});
