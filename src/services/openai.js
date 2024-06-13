import axios from 'axios';

const apiKey = process.env.REACT_APP_OPENAI_API_KEY;

export const fetchGPTResponse = async (messages) => {
    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-3.5-turbo',
                messages: messages,
                max_tokens: 1000,
                temperature: 0.7,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching GPT response:', error);
        throw error;
    }
};