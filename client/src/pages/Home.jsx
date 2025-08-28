// export default Home;

// import React, { useState, useRef, useEffect } from 'react';
// import axios from 'axios';

// const clientId = 'C001';

// const Home = () => {
//     const [message, setMessage] = useState('');
//     const [conversation, setConversation] = useState([]);
//     const messagesEndRef = useRef(null);

//     useEffect(() => {
//         messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//     }, [conversation]);

//     const sendMessage = async () => {
//         if (!message.trim()) return;

//         const newMsg = { sender: 'client', message };
//         setConversation((prev) => [...prev, newMsg]);

//         try {
//             const res = await axios.post('http://localhost:5000/api/chat', {
//                 message,
//                 client_id: clientId,
//             });

//             const fullReply = res.data.reply;
//             let displayedText = '';
//             const typingSpeed = 30; // ms per character

//             // Add empty agent message first
//             setConversation((prev) => [
//                 ...prev,
//                 { sender: 'agent', message: '' },
//             ]);

//             let i = 0;
//             const interval = setInterval(() => {
//                 if (i < fullReply.length) {
//                     displayedText += fullReply[i];
//                     setConversation((prev) => {
//                         const updated = [...prev];
//                         updated[updated.length - 1] = {
//                             sender: 'agent',
//                             message: displayedText,
//                         };
//                         return updated;
//                     });
//                     i++;
//                 } else {
//                     clearInterval(interval);
//                 }
//             }, typingSpeed);
//         } catch (err) {
//             console.error('Send failed:', err);
//         }

//         setMessage('');
//     };

//     return (
//         <div style={{ padding: 20 }} className="bg-black text-white">
//             <h2>AI Agent Chat</h2>
//             <div
//                 className="mt-3"
//                 style={{
//                     border: '1px solid #ccc',
//                     padding: 10,
//                     height: 350,
//                     overflowY: 'auto',
//                 }}
//             >
//                 {conversation.map((msg, i) => (
//                     <div key={i} style={{ marginBottom: 10 }}>
//                         <b>{msg.sender === 'client' ? 'You' : 'Agent'}:</b>{' '}
//                         {msg.message}
//                     </div>
//                 ))}
//                 <div ref={messagesEndRef} />
//             </div>

//             <div className="mt-3">
//                 <textarea
//                     className="form-control"
//                     rows="4"
//                     value={message}
//                     onChange={(e) => setMessage(e.target.value)}
//                     onKeyDown={(e) =>
//                         e.key === 'Enter' && !e.shiftKey && sendMessage()
//                     }
//                     placeholder="Type your message"
//                 ></textarea>
//             </div>
//             <div className="d-flex justify-content-center mt-3">
//                 <button
//                     onClick={sendMessage}
//                     className="btn btn-primary fw-bold py-2 px-3"
//                     type="button"
//                     style={{ width: '150px' }}
//                 >
//                     Send
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default Home;

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

            // Add empty agent message first
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
        <div className="bg-black">
            <div style={{ padding: 20 }} className=" text-white w-50 mx-auto">
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
                        <div
                            key={i}
                            style={{
                                marginBottom: 10,
                                padding: '8px 12px',
                                borderRadius: 10,
                                // maxWidth: '80%',
                                background:
                                    msg.sender === 'client'
                                        ? '#1E90FF' // blue for client
                                        : '#2E2E2E', // dark gray for agent
                                alignSelf:
                                    msg.sender === 'client'
                                        ? 'flex-end'
                                        : 'flex-start',
                            }}
                        >
                            <b>{msg.sender === 'client' ? 'You' : 'Agent'}:</b>{' '}
                            {msg.message}
                        </div>
                    ))}

                    {/* Show loading dots while waiting */}
                    {loading && (
                        <div
                            style={{
                                marginBottom: 10,
                                padding: '8px 12px',
                                borderRadius: 10,
                                // maxWidth: '60%',
                                background: '#2E2E2E',
                                fontStyle: 'italic',
                            }}
                        >
                            Agent is typing<span className="dot-ani">...</span>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                <div className="mt-3">
                    <textarea
                        className="form-control"
                        rows="4"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) =>
                            e.key === 'Enter' && !e.shiftKey && sendMessage()
                        }
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
            `}</style>
            </div>
        </div>
    );
};

export default Home;
