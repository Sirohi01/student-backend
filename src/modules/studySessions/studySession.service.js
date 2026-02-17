const revisionService = require('../revision/revision.service');
const achievementService = require('../achievements/achievement.service');
const StudySession = require('./studySession.model');
const AppError = require('../../utils/AppError');

exports.logSession = async (userId, data) => {
    const session = await StudySession.create({
        ...data,
        user: userId,
    });

    // Automatically schedule revision tasks
    setImmediate(() => {
        revisionService.scheduleRevision(session._id).catch(err => {
            console.error('Failed to schedule revision:', err);
        });
    });

    // Update streak and check achievements
    setImmediate(() => {
        achievementService.updateStreak(userId, data.duration).catch(err => {
            console.error('Failed to update streak:', err);
        });

        // Check for perfect focus achievement
        if (data.focusScore === 100) {
            achievementService.checkAndAwardAchievement(userId, 'perfect_focus').catch(err => {
                console.error('Failed to award achievement:', err);
            });
        }

        // Check for early bird/night owl
        const hour = new Date(data.startTime).getHours();
        if (hour < 6) {
            achievementService.checkAndAwardAchievement(userId, 'early_bird').catch(err => {
                console.error('Failed to award achievement:', err);
            });
        } else if (hour >= 23) {
            achievementService.checkAndAwardAchievement(userId, 'night_owl').catch(err => {
                console.error('Failed to award achievement:', err);
            });
        }
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
