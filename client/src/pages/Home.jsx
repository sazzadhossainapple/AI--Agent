import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const clientId = 'C001';

const Home = () => {
    const [message, setMessage] = useState('');
    const [conversation, setConversation] = useState([]);
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [conversation, loading]);

    const sendMessage = async () => {
        if (!message.trim()) return;

        const newMsg = { sender: 'client', message };
        setConversation((prev) => [...prev, newMsg]);
        setMessage('');
        setLoading(true);

        try {
            const res = await axios.post('http://localhost:5000/api/chat', {
                message,
                client_id: clientId,
            });

            const fullReply = res.data.reply;
            let displayedText = '';
            const typingSpeed = 30; // ms per character

            // Add an empty agent message first (for typing effect)
            setConversation((prev) => [
                ...prev,
                { sender: 'agent', message: '' },
            ]);

            let i = 0;
            const interval = setInterval(() => {
                if (i < fullReply.length) {
                    displayedText += fullReply[i];
                    setConversation((prev) => {
                        const updated = [...prev];
                        updated[updated.length - 1] = {
                            sender: 'agent',
                            message: displayedText,
                        };
                        return updated;
                    });
                    i++;
                } else {
                    clearInterval(interval);
                    setLoading(false);
                }
            }, typingSpeed);
        } catch (err) {
            console.error('Send failed:', err);
            setLoading(false);
        }
    };

    return (
        <div
            className="bg-black text-white d-flex flex-column align-items-center"
            style={{ minHeight: '100vh', paddingTop: 40 }}
        >
            <div
                className="chat-container"
                style={{
                    width: '60%',
                    backgroundColor: '#121212',
                    borderRadius: 10,
                    padding: 20,
                    boxShadow: '0 0 10px rgba(255, 255, 255, 0.1)',
                }}
            >
                <h3 className="text-center mb-4">AI Agent Chat</h3>

                <div
                    className="chat-box"
                    style={{
                        height: 400,
                        overflowY: 'auto',
                        padding: '10px 15px',
                        border: '1px solid #333',
                        borderRadius: 10,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        backgroundColor: '#0d0d0d',
                    }}
                >
                    {conversation.map((msg, i) => (
                        <div
                            key={i}
                            style={{
                                display: 'flex',
                                justifyContent:
                                    msg.sender === 'client'
                                        ? 'flex-end'
                                        : 'flex-start',
                            }}
                        >
                            <div
                                style={{
                                    background:
                                        msg.sender === 'client'
                                            ? '#0078ff'
                                            : '#2a2a2a',
                                    color: 'white',
                                    padding: '10px 14px',
                                    borderRadius: '10px',
                                    maxWidth: '75%',
                                    lineHeight: 1.5,
                                    whiteSpace: 'pre-wrap',
                                }}
                            >
                                <b>
                                    {msg.sender === 'client'
                                        ? 'You'
                                        : 'Agent'}
                                    :
                                </b>{' '}
                                {msg.message}
                            </div>
                        </div>
                    ))}

                    {loading && (
                        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                            <div
                                style={{
                                    background: '#2a2a2a',
                                    color: 'white',
                                    padding: '10px 14px',
                                    borderRadius: '10px',
                                    fontStyle: 'italic',
                                }}
                            >
                                Agent is typing<span className="dot-ani">...</span>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                <div className="mt-3">
                    <textarea
                        className="form-control bg-dark text-white"
                        rows="3"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) =>
                            e.key === 'Enter' && !e.shiftKey && sendMessage()
                        }
                        placeholder="Type your message..."
                        style={{
                            resize: 'none',
                            borderRadius: 8,
                            border: '1px solid #333',
                        }}
                    ></textarea>
                </div>

                <div className="d-flex justify-content-center mt-3">
                    <button
                        onClick={sendMessage}
                        className="btn btn-primary fw-bold py-2 px-4"
                        type="button"
                        style={{ width: '150px' }}
                    >
                        Send
                    </button>
                </div>
            </div>

            {/* Typing dots animation */}
            <style>{`
                .dot-ani::after {
                    content: '';
                    animation: dots 1.5s steps(5, end) infinite;
                }
                @keyframes dots {
                    0%, 20% { content: ''; }
                    40% { content: '.'; }
                    60% { content: '..'; }
                    80%, 100% { content: '...'; }
                }

                /* Scrollbar styling */
                .chat-box::-webkit-scrollbar {
                    width: 6px;
                }
                .chat-box::-webkit-scrollbar-thumb {
                    background: #333;
                    border-radius: 10px;
                }
            `}</style>
        </div>
    );
};

export default Home;
