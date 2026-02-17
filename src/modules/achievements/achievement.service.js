const { Achievement, Streak } = require('./achievement.model');

// Update streak when user completes a study session
exports.updateStreak = async (userId, sessionDuration) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let streak = await Streak.findOne({ user: userId });

    if (!streak) {
        streak = await Streak.create({
            user: userId,
            currentStreak: 1,
            longestStreak: 1,
            lastStudyDate: today,
            totalStudyDays: 1,
            totalHours: sessionDuration / 60,
        });

        // Award first session achievement
        await this.checkAndAwardAchievement(userId, 'first_session');
        return streak;
    }

    const lastStudy = new Date(streak.lastStudyDate);
    lastStudy.setHours(0, 0, 0, 0);
    const daysDiff = Math.floor((today - lastStudy) / (1000 * 60 * 60 * 24));

    if (daysDiff === 0) {
        // Same day, just update hours
        streak.totalHours += sessionDuration / 60;
    } else if (daysDiff === 1) {
        // Consecutive day
        streak.currentStreak += 1;
        streak.lastStudyDate = today;
        streak.totalStudyDays += 1;
        streak.totalHours += sessionDuration / 60;

        if (streak.currentStreak > streak.longestStreak) {
            streak.longestStreak = streak.currentStreak;
        }

        // Check streak achievements
        if (streak.currentStreak === 7) await this.checkAndAwardAchievement(userId, 'streak_7');
        if (streak.currentStreak === 30) await this.checkAndAwardAchievement(userId, 'streak_30');
        if (streak.currentStreak === 100) await this.checkAndAwardAchievement(userId, 'streak_100');
    } else {
        // Streak broken
        streak.currentStreak = 1;
        streak.lastStudyDate = today;
        streak.totalStudyDays += 1;
        streak.totalHours += sessionDuration / 60;
    }

    // Check hour achievements
    if (streak.totalHours >= 10) await this.checkAndAwardAchievement(userId, 'hours_10');
    if (streak.totalHours >= 50) await this.checkAndAwardAchievement(userId, 'hours_50');
    if (streak.totalHours >= 100) await this.checkAndAwardAchievement(userId, 'hours_100');

    await streak.save();
    return streak;
};

exports.getStreak = async (userId) => {
    let streak = await Streak.findOne({ user: userId });
    if (!streak) {
        streak = await Streak.create({
            user: userId,
            currentStreak: 0,
            longestStreak: 0,
            totalStudyDays: 0,
            totalHours: 0,
        });
    }
    return streak;
};

exports.checkAndAwardAchievement = async (userId, type) => {
    const existing = await Achievement.findOne({ user: userId, type });
    if (existing) return null;

    const achievementData = {
        first_session: { title: 'First Steps', description: 'Completed your first study session', icon: '🎯' },
        streak_7: { title: 'Week Warrior', description: '7 day study streak', icon: '🔥' },
        streak_30: { title: 'Monthly Master', description: '30 day study streak', icon: '⭐' },
        streak_100: { title: 'Century Champion', description: '100 day study streak', icon: '👑' },
        hours_10: { title: 'Getting Started', description: 'Studied for 10 hours', icon: '📚' },
        hours_50: { title: 'Dedicated Learner', description: 'Studied for 50 hours', icon: '💪' },
        hours_100: { title: 'Study Legend', description: 'Studied for 100 hours', icon: '🏆' },
        flashcards_100: { title: 'Card Collector', description: 'Reviewed 100 flashcards', icon: '🎴' },
        flashcards_500: { title: 'Memory Master', description: 'Reviewed 500 flashcards', icon: '🧠' },
        perfect_focus: { title: 'Laser Focus', description: 'Maintained 100% focus for a session', icon: '🎯' },
        early_bird: { title: 'Early Bird', description: 'Studied before 6 AM', icon: '🌅' },
        night_owl: { title: 'Night Owl', description: 'Studied after 11 PM', icon: '🦉' },
        task_master: { title: 'Task Master', description: 'Completed 50 tasks', icon: '✅' },
    };

    const data = achievementData[type];
    if (!data) return null;

    const achievement = await Achievement.create({
        user: userId,
        type,
        ...data,
    });

    return achievement;
};

exports.getUserAchievements = async (userId) => {
    return await Achievement.find({ user: userId }).sort({ unlockedAt: -1 });
};

exports.getLeaderboard = async (limit = 10) => {
    return await Streak.find()
        .sort({ currentStreak: -1, totalHours: -1 })
        .limit(limit)
        .populate('user', 'name email');
};

module.exports = exports;
