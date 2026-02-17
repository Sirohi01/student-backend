const revisionService = require('../revision/revision.service');
const StudySession = require('./studySession.model');
const AppError = require('../../utils/AppError');

exports.logSession = async (userId, data) => {
    const session = await StudySession.create({
        ...data,
        user: userId,
    });

    // Automatically schedule revision tasks
    // Use setImmediate or process.nextTick to avoid blocking the response
    setImmediate(() => {
        revisionService.scheduleRevision(session._id).catch(err => {
            console.error('Failed to schedule revision:', err);
        });
    });

    return session;
};

exports.getUserSessions = async (userId) => {
    return await StudySession.find({ user: userId })
        .sort({ startTime: -1 })
        .populate('subject', 'name color icon')
        .populate('task', 'title');
};

exports.getSessionStats = async (userId) => {
    // Aggregate total duration per subject
    const stats = await StudySession.aggregate([
        { $match: { user: userId } },
        {
            $group: {
                _id: '$subject',
                totalDuration: { $sum: '$duration' },
                sessions: { $sum: 1 },
                avgFocus: { $avg: '$focusScore' },
            },
        },
        { $lookup: { from: 'subjects', localField: '_id', foreignField: '_id', as: 'subject' } },
        { $unwind: '$subject' },
        {
            $project: {
                subjectName: '$subject.name',
                color: '$subject.color',
                totalDuration: 1,
                sessions: 1,
                avgFocus: 1,
            },
        },
    ]);
    return stats;
};
