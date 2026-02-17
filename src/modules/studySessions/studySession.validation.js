const Joi = require('joi');

const logSession = Joi.object({
    subject: Joi.string().required(),
    task: Joi.string().allow(null, ''),
    startTime: Joi.date().iso().required(),
    endTime: Joi.date().iso().required(),
    duration: Joi.number().min(1).required(),
    focusScore: Joi.number().min(0).max(100),
    notes: Joi.string().allow('', null),
});

module.exports = {
    logSession,
};
