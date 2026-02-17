const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

exports.generateStudyPlan = async (subjects, examDate, availableHours) => {
    const prompt = `
    Create a study plan for a student with the following details:
    Subjects: ${subjects.join(', ')}
    Exam Date: ${examDate}
    Available Hours per Day: ${availableHours}
    
    Output a JSON object with a daily schedule.
  `;

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                { role: "system", content: "You are a helpful study planner assistant." },
                { role: "user", content: prompt }
            ],
            response_format: { type: "json_object" },
        });

        return JSON.parse(response.choices[0].message.content);
    } catch (error) {
        console.error('OpenAI Error:', error);
        throw new Error('Failed to generate study plan');
    }
};
