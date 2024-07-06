import React, { useState } from 'react';
import './messagePassing.css';

const MessagePassing = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const receiverResponses = [
    'Hello! How can I help you?',
    'Sure, I can assist with that.',
    'Please wait a moment.',
    'I will get back to you shortly.',
    'Thank you for your patience.',
    'Can you please provide more details?',
    'I understand. Let me check on that.',
    'Thank you for reaching out.',
    'Is there anything else I can help with?',
    'Goodbye!'
  ];

  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      const userMessage = { text: newMessage, timestamp: new Date(), sender: 'user' };
      setMessages([...messages, userMessage]);

      setNewMessage('');

      // Simulate receiver response
      setTimeout(() => {
        const randomResponse = receiverResponses[Math.floor(Math.random() * receiverResponses.length)];
        const receiverMessage = { text: randomResponse, timestamp: new Date(), sender: 'receiver' };
        setMessages(prevMessages => [...prevMessages, receiverMessage]);
      }, 1000); // Delay the response by 1 second
    }
  };

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
  };

  return (
    <div className="message-passing">
      <h1>Message Passing</h1>

      <div className="chat-window">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <div key={index} className={`chat-message ${message.sender}`}>
              <span>{message.text}</span>
              <span className="timestamp">{message.timestamp.toLocaleTimeString()}</span>
            </div>
          ))
        ) : (
          <div className="no-messages">No messages yet</div>
        )}
      </div>

      <div className="chat-input">
        <input
          type="text"
          value={newMessage}
          onChange={handleInputChange}
          placeholder="Type your message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default MessagePassing;
