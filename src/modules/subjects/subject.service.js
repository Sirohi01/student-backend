const Subject = require('./subject.model');
const AppError = require('../../utils/AppError');

exports.createSubject = async (userId, data) => {
    // Check for duplicates handled by DB index, but we can catch friendly here if needed
    const subject = await Subject.create({
        ...data,
        user: userId,
    });
    return subject;
};

exports.getAllSubjects = async (userId) => {
    return await Subject.find({ user: userId }).sort({ name: 1 });
};

exports.getSubjectById = async (userId, subjectId) => {
    const subject = await Subject.findOne({ _id: subjectId, user: userId });
    if (!subject) {
        throw new AppError('Subject not found', 404);
    }
    return subject;
};

exports.updateSubject = async (userId, subjectId, data) => {
    const subject = await Subject.findOneAndUpdate(
        { _id: subjectId, user: userId },
        data,
        { new: true, runValidators: true }
    );

    if (!subject) {
        throw new AppError('Subject not found', 404);
    }
    return subject;
};

exports.deleteSubject = async (userId, subjectId) => {
    const subject = await Subject.findOneAndDelete({ _id: subjectId, user: userId });

    if (!subject) {
        throw new AppError('Subject not found', 404);
    }

    // TODO: Delete associated tasks/topics/sessions if needed
    return subject;
};
