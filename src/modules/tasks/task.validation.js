const Joi = require('joi');

const createTask = Joi.object({
    title: Joi.string().required().trim(),
    description: Joi.string().allow('').trim(),
    dueDate: Joi.date().iso().required(),
    priority: Joi.string().valid('low', 'medium', 'high'),
    status: Joi.string().valid('todo', 'in-progress', 'completed'),
    subject: Joi.string().required(), // Subject ID
});

const updateTask = Joi.object({
    title: Joi.string().trim(),
    description: Joi.string().allow('').trim(),
    dueDate: Joi.date().iso(),
    priority: Joi.string().valid('low', 'medium', 'high'),
    status: Joi.string().valid('todo', 'in-progress', 'completed'),
    subject: Joi.string(),
});

module.exports = {
    createTask,
    updateTask,
};
