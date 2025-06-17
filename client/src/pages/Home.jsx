import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const clientId = 'C001';

const Home = () => {
    const [message, setMessage] = useState('');
    const [conversation, setConversation] = useState([]);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [conversation]);

    const sendMessage = async () => {
        if (!message.trim()) return;

        const newMsg = { sender: 'client', message };
        setConversation((prev) => [...prev, newMsg]);

        try {
            const res = await axios.post('http://localhost:5000/api/chat', {
                message,
                client_id: clientId,
            });
            const reply = { sender: 'agent', message: res.data.reply };
            setConversation((prev) => [...prev, reply]);
        } catch (err) {
            console.error('Send failed:', err);
        }

        setMessage('');
    };

    return (
        <div style={{ padding: 20 }} className="bg-black text-white">
            <h2>AI Agent Chat</h2>
            <div
                className="mt-3"
                style={{
                    border: '1px solid #ccc',
                    padding: 10,
                    height: 350,
                    overflowY: 'auto',
                }}
            >
                {conversation.map((msg, i) => (
                    <div key={i} style={{ marginBottom: 10 }}>
                        <b>{msg.sender === 'client' ? 'You' : 'Agent'}:</b>{' '}
                        {msg.message}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <div className="mt-3">
                <textarea
                    id=""
                    className="form-control"
                    type="text"
                    rows="4"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type your message"
                ></textarea>
            </div>
            <div className="d-flex justify-content-center mt-3">
                <button
                    onClick={sendMessage}
                    className="btn btn-primary fw-bold py-2 px-3"
                    type="button"
                    style={{ width: '150px' }}
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default Home;
