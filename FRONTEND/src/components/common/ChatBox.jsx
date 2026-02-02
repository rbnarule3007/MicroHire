import React, { useState, useEffect, useRef } from 'react';
import { Send, User, MessageCircle } from 'lucide-react';
import { API } from '../../config';

const ChatBox = ({ jobId, currentUser }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef(null);

    const fetchMessages = async () => {
        try {
            const res = await fetch(`${API}/api/messages/job/${jobId}`);
            if (res.ok) {
                const data = await res.json();
                setMessages(data);
            }
        } catch (err) {
            console.error("Failed to fetch messages", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
        const interval = setInterval(fetchMessages, 5000); // Poll every 5s
        return () => clearInterval(interval);
    }, [jobId]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const messageData = {
            jobId: jobId,
            senderId: currentUser.userId,
            senderRole: currentUser.role,
            content: newMessage,
            // Determine receiverId: if sender is CLIENT, receiver is FREELANCER (we'll need the other party's ID)
            // For now, the backend doesn't strictly enforce receiverId in the repo if we just query by jobId
        };

        try {
            const res = await fetch(`${API}/api/messages/send`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(messageData)
            });
            if (res.ok) {
                setNewMessage('');
                fetchMessages();
            }
        } catch (err) {
            console.error("Failed to send message", err);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-[500px]">
            <div className="p-4 border-b border-gray-100 flex items-center gap-2">
                <MessageCircle size={20} className="text-blue-600" />
                <h3 className="font-bold text-gray-900">Project Communication</h3>
            </div>

            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50"
            >
                {loading ? (
                    <div className="text-center py-4 text-gray-500 text-sm">Loading messages...</div>
                ) : messages.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-400 text-sm italic">No messages yet. Start the conversation!</p>
                    </div>
                ) : (
                    messages.map((msg) => {
                        const isMine = msg.senderId == currentUser.userId;
                        return (
                            <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] rounded-2xl px-4 py-2 shadow-sm ${isMine
                                    ? 'bg-blue-600 text-white rounded-tr-none'
                                    : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                                    }`}>
                                    <div className={`text-[10px] font-bold uppercase mb-1 ${isMine ? 'text-blue-100' : 'text-gray-400'}`}>
                                        {msg.senderRole}
                                    </div>
                                    <p className="text-sm leading-relaxed">{msg.content}</p>
                                    <div className={`text-[10px] mt-1 text-right ${isMine ? 'text-blue-200' : 'text-gray-400'}`}>
                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-100 bg-white">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm active:scale-95"
                    >
                        <Send size={20} />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChatBox;
