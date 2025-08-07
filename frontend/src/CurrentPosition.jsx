// src/CurrentPosition.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ChatBase.css';
import { sendPositionChat } from './api';

function CurrentPosition() {
  const location = useLocation();
  const navigate = useNavigate();
  const topic = location.state?.topic;
  const topicLabel = topic?.label || 'Unknown Topic';

  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: `Please describe your opinion on ${topicLabel}. Feel free to include your core related beliefs, why the topic is important to you, and other information that is important to your opinion.`
    }
  ]);
  const [input, setInput] = useState('');
  const [conversationId, setConversationId] = useState(() => {
    const saved = sessionStorage.getItem('positionConversationId');
    console.log('Loaded conversationId from sessionStorage:', saved); // ??????
    if (saved) return saved;
    const newId = crypto.randomUUID();
    sessionStorage.setItem('positionConversationId', newId);
    return newId;
  });
  const [summaryReady, setSummaryReady] = useState(false);
  const chatBoxRef = useRef(null);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userText = input;
    setMessages(prev => [...prev, { sender: 'user', text: userText }, { sender: 'bot', text: 'Typing...' }]);
    setInput('');


    try {
        const res = await sendPositionChat(conversationId, userText, topicLabel);


      const reply = res.data.reply;
      setMessages(prev => [
        ...prev.slice(0, -1), // remove 'Typing...'
        { sender: 'bot', text: reply }
      ]);

      if (reply.includes('__SUMMARY_COMPLETE__')) {
        setSummaryReady(true);
      }
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [
        ...prev.slice(0, -1),
        { sender: 'bot', text: 'Sorry, something went wrong.' }
      ]);
    }
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleProceed = () => {
    const summaryMessage = messages.find(m => m.text.includes('__SUMMARY_COMPLETE__'))?.text.replace('__SUMMARY_COMPLETE__', '').trim();
    navigate('/play', { state: { summary: summaryMessage, topic: topicLabel, conversationId } });
  };
  return (
    <>
      <div className="position-page">
        {/* Header */}
        <div className="page-header">
          <span className="page-title">Summary Phase</span>
        </div>
        <p className="page-subtitle">
          Please describe your views on this topic. What do you believe, and why? This helps us understand your perspective before the debate begins.
        </p>
  
        {/* Messages */}
        <div className="chat-box" ref={chatBoxRef}>
          {messages.map((msg, index) => (
            <div key={index} className={`message-wrapper ${msg.sender}`}>
              {msg.sender === 'bot' && (
                <img src="/robot.png" alt="Bot" className="bot-avatar" />
              )}
              <div className={`message ${msg.sender}-message`}>
                {msg.sender === 'bot'
                  ? msg.text.replace('__SUMMARY_COMPLETE__', '').trim()
                  : msg.text}
              </div>
            </div>
          ))}
        </div>
  
        {/* Input */}
        <div className="chat-input-area">
          <textarea
            className="chat-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            rows={1}
          />
          <button className="send-button" onClick={handleSend}>Send</button>
        </div>
      </div>
  
      {/* Proceed button outside the chat box */}
      {summaryReady && (
        <div className="proceed-button-wrapper">
          <button className="proceed-button" onClick={handleProceed}>
            I'm happy with the summary — proceed to debate
          </button>
        </div>
      )}
    </>
  );
}
export default CurrentPosition;  