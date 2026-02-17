const subjectService = require('./subject.service');
const asyncHandler = require('../../utils/asyncHandler');
const sendResponse = require('../../utils/responseHandler');
const { createSubject, updateSubject } = require('./subject.validation');
const AppError = require('../../utils/AppError');

exports.createSubject = asyncHandler(async (req, res, next) => {
    const { error } = createSubject.validate(req.body);
    if (error) return next(new AppError(error.details[0].message, 400));

    const subject = await subjectService.createSubject(req.user.id, req.body);
    sendResponse(res, 201, true, 'Subject created successfully', subject);
});

exports.getAllSubjects = asyncHandler(async (req, res, next) => {
    const subjects = await subjectService.getAllSubjects(req.user.id);
    sendResponse(res, 200, true, 'Subjects retrieved successfully', subjects);
});

exports.getSubject = asyncHandler(async (req, res, next) => {
    const subject = await subjectService.getSubjectById(req.user.id, req.params.id);
    sendResponse(res, 200, true, 'Subject retrieved successfully', subject);
});

exports.updateSubject = asyncHandler(async (req, res, next) => {
    const { error } = updateSubject.validate(req.body);
    if (error) return next(new AppError(error.details[0].message, 400));

    const subject = await subjectService.updateSubject(req.user.id, req.params.id, req.body);
    sendResponse(res, 200, true, 'Subject updated successfully', subject);
});

exports.deleteSubject = asyncHandler(async (req, res, next) => {
    await subjectService.deleteSubject(req.user.id, req.params.id);
    sendResponse(res, 200, true, 'Subject deleted successfully');
});
