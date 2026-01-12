import React, { useState, useRef, useEffect } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { Message } from './index';

interface ChatbotWindowProps {
    onClose: () => void;
    messages: Message[];
    setMessages: Dispatch<SetStateAction<Message[]>>;
}

const QUICK_REPLIES = [
    'Có những dòng iPhone nào?',
    'Điện thoại giá rẻ',
    'So sánh Samsung vs iPhone',
];

const ChatbotWindow: React.FC<ChatbotWindowProps> = ({ onClose, messages, setMessages }) => {
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const generateId = () => {
        return Date.now().toString() + Math.random().toString(36).substr(2, 9);
    };

    const sendMessage = async (messageText: string) => {
        if (!messageText.trim() || isLoading) return;

        const userMessage: Message = {
            id: generateId(),
            type: 'user',
            content: messageText.trim(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:9090/api/ai/phone-chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: messageText.trim() }),
            });

            if (!response.ok) {
                throw new Error('API request failed');
            }

            const data = await response.json();

            const botMessage: Message = {
                id: generateId(),
                type: 'bot',
                content: data.reply || 'Xin lỗi, tôi không thể xử lý yêu cầu này.',
            };

            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error('Chatbot API error:', error);
            const errorMessage: Message = {
                id: generateId(),
                type: 'bot',
                content: 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.',
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        sendMessage(inputValue);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage(inputValue);
        }
    };

    const handleQuickReply = (text: string) => {
        sendMessage(text);
    };

    return (
        <div className="chatbot-window">
            {/* Header */}
            <div className="chatbot-header">
                <div className="chatbot-header-info">
                    <div className="chatbot-avatar">
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                        </svg>
                    </div>
                    <div className="chatbot-header-text">
                        <h3>Trợ lý CellPhoneS</h3>
                        <span>Đang hoạt động</span>
                    </div>
                </div>
                <button className="chatbot-close-btn" onClick={onClose} aria-label="Đóng">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                    </svg>
                </button>
            </div>

            {/* Messages */}
            <div className="chatbot-messages">
                {messages.length === 0 && (
                    <div className="chatbot-welcome">
                        <div className="chatbot-welcome-icon">
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
                            </svg>
                        </div>
                        <h4>Xin chào! 👋</h4>
                        <p>Tôi là trợ lý ảo của CellPhoneS. Hãy hỏi tôi bất cứ điều gì về điện thoại!</p>
                        <div className="chatbot-quick-replies">
                            {QUICK_REPLIES.map((text, index) => (
                                <button
                                    key={index}
                                    className="quick-reply-btn"
                                    onClick={() => handleQuickReply(text)}
                                >
                                    {text}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {messages.map(message => (
                    <div key={message.id} className={`chatbot-message ${message.type}`}>
                        <div className="message-avatar">
                            {message.type === 'bot' ? (
                                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                                </svg>
                            ) : (
                                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                </svg>
                            )}
                        </div>
                        <div className="message-content">{message.content}</div>
                    </div>
                ))}

                {isLoading && (
                    <div className="chatbot-message bot">
                        <div className="message-avatar">
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                            </svg>
                        </div>
                        <div className="typing-indicator">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form className="chatbot-input-area" onSubmit={handleSubmit}>
                <div className="chatbot-input-wrapper">
                    <textarea
                        ref={inputRef}
                        className="chatbot-input"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Nhập tin nhắn..."
                        rows={1}
                        disabled={isLoading}
                    />
                </div>
                <button
                    type="submit"
                    className="chatbot-send-btn"
                    disabled={!inputValue.trim() || isLoading}
                    aria-label="Gửi tin nhắn"
                >
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                    </svg>
                </button>
            </form>
        </div>
    );
};

export default ChatbotWindow;