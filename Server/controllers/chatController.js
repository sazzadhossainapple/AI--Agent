const Conversation = require('../models/Conversation');
const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENROUTER_API_KEY,
});

exports.getConversations = async (req, res) => {
    try {
        const convos = await Conversation.findAll({
            order: [['createdAt', 'DESC']],
            limit: 10,
        });
        res.json(convos.reverse());
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error fetching conversations' });
    }
};

exports.sendMessage = async (req, res) => {
    const { message, client_id } = req.body;

    if (!message) return res.status(400).json({ error: 'Message is required' });

    try {
        const history = await Conversation.findAll({
            where: { client_id },
            order: [['createdAt', 'ASC']],
            limit: 10,
        });

        const promptHistory = history
            .map((m) => `${m.sender}: ${m.message}`)
            .join('\n');

        const chatMessages = [
            { role: 'system', content: 'You are a helpful AI support agent.' },
            { role: 'user', content: `${promptHistory}\nclient: ${message}` },
        ];

        const completion = await openai.chat.completions.create({
            model: 'openai/gpt-3.5-turbo',
            messages: chatMessages,
        });

        const reply = completion.choices[0].message.content;

        // Save client message
        await Conversation.create({
            client_id,
            sender: 'client',
            message,
        });

        // Save agent reply with agent_id
        await Conversation.create({
            client_id,
            agent_id: 'A001', // Set this dynamically if you have multiple agents
            sender: 'agent',
            message: reply,
        });

        res.json({ reply });
    } catch (err) {
        console.error('AI API Error:', err);
        res.status(500).json({ error: 'AI API error' });
    }
};
