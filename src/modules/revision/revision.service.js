const Task = require('../tasks/task.model');
const StudySession = require('../studySessions/studySession.model');

// Spaced Repetition Schedule (days)
const SCHEDULE = [1, 3, 7, 14, 30];

exports.scheduleRevision = async (sessionId) => {
    const session = await StudySession.findById(sessionId).populate('subject');
    if (!session) return;

    const subject = session.subject;
    const topic = session.notes ? session.notes.substring(0, 50) + "..." : "Review Session"; // Use notes as topic or generic

    const tasks = [];

    for (const days of SCHEDULE) {
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + days);

        tasks.push({
            title: `Revision: ${subject.name} - ${topic}`,
            description: `Spaced repetition review (Day ${days}) based on study session from ${new Date(session.startTime).toLocaleDateString()}`,
            dueDate: dueDate,
            priority: 'high',
            status: 'todo',
            subject: subject._id,
            user: session.user,
        });
    }

    // Create tasks in bulk
    if (tasks.length > 0) {
        await Task.insertMany(tasks);
        console.log(`Created ${tasks.length} revision tasks for user ${session.user}`);
    }
};
