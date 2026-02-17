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
            model: "gpt-3.5-turbo",
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

exports.generateFlashcards = async (subject, topic, count = 5, apiKey) => {
    // Use user's API key if provided, otherwise use env variable
    const OpenAI = require('openai');
    const openaiClient = new OpenAI({
        apiKey: apiKey || process.env.OPENAI_API_KEY,
    });

    const prompt = `
    Generate ${count} educational flashcards for the subject "${subject}" on the topic "${topic}".
    
    Each flashcard should have:
    - A clear, concise question (front)
    - A detailed but focused answer (back)
    
    Make them suitable for spaced repetition learning.
    Return as a JSON array with objects containing "front" and "back" fields.
    `;


    try {
        const response = await openaiClient.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are an expert educational content creator. Return ONLY a JSON array of flashcards." },
                { role: "user", content: prompt }
            ],
        });

        const content = response.choices[0].message.content;
        console.log('OpenAI Response:', content);

        // Try to parse JSON from the response
        let result;
        try {
            result = JSON.parse(content);
        } catch (parseError) {
            // If direct parse fails, try to extract JSON array
            const jsonMatch = content.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                result = JSON.parse(jsonMatch[0]);
            } else {
                throw new Error('Could not parse flashcards from AI response');
            }
        }

        // Handle both {flashcards: [...]} and direct array formats
        const flashcards = Array.isArray(result) ? result : (result.flashcards || result.cards || []);

        if (!flashcards.length) {
            throw new Error('No flashcards generated');
        }

        return flashcards;
    } catch (error) {
        console.error('OpenAI Error:', error);

        // If quota exceeded, return mock flashcards for demo
        if (error.message && error.message.includes('quota')) {
            console.log('OpenAI quota exceeded, using mock flashcards');
            return [
                {
                    front: `What is ${topic}?`,
                    back: `${topic} is a key concept in ${subject}. (AI quota exceeded - this is a demo card)`
                },
                {
                    front: `Why is ${topic} important in ${subject}?`,
                    back: `Understanding ${topic} helps build foundation in ${subject}. (Demo card)`
                },
                {
                    front: `Name one key aspect of ${topic}`,
                    back: `Key aspects include fundamental principles and applications. (Demo card)`
                },
                {
                    front: `How does ${topic} relate to ${subject}?`,
                    back: `${topic} is an essential part of ${subject} curriculum. (Demo card)`
                },
                {
                    front: `What should you remember about ${topic}?`,
                    back: `Focus on core concepts and practical applications. (Demo card)`
                }
            ];
        }

        throw new Error('Failed to generate flashcards: ' + error.message);
    }
};
