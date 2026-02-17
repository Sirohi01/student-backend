const Joi = require('joi');

const createSubject = Joi.object({
    name: Joi.string().required().trim(),
    color: Joi.string().pattern(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i).message('Invalid color hex code'),
    icon: Joi.string(),
});

const updateSubject = Joi.object({
    name: Joi.string().trim(),
    color: Joi.string().pattern(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i),
    icon: Joi.string(),
});

module.exports = {
    createSubject,
    updateSubject,
};
