// src/Chat.jsx
import React, { useState, useRef, useEffect } from 'react';
import './ChatBase.css';
import { sendDebateChat, createProfile } from "./api";
import { useLocation, useNavigate } from 'react-router-dom';

function Chat() {
  const location = useLocation();
  const passedConversationId = location.state?.conversationId;
  const summary = location.state?.summary;
  const topic = location.state?.topic;

  const [conversationId, setConversationId] = useState('');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const [profile, setProfile] = useState(''); // Store the generated profile

  const textareaRef = useRef(null);
  const chatBoxRef = useRef(null);

  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes = 300 seconds

  const hasInitialized = useRef(false);

  const navigate = useNavigate();
  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate('/results');
    }, 5 * 60 * 1000); // Redirect to results after 5 minutes

    return () => clearTimeout(timeout); // Cleanup on unmount
  }, []);

  // Setup conversation on mount
  useEffect(() => {
    if (hasInitialized.current) return; // Prevent re-initialization
    hasInitialized.current = true;
    if (!summary || !topic) {
      console.warn("Missing topic or summary — redirecting to homepage");
      navigate('/');
      return;
    }
  
    const startDebate = async (convId) => {
      try {
        const res = await createProfile(convId, topic, summary);
        setProfile(res.data.profile); // Store the generated profile
        console.log("✅ Profile generated:", res.data.profile);
      } catch (err) {
        console.error("❌ Failed to generate profile:", err);
      }
    };
    
    if (passedConversationId) {
      setConversationId(passedConversationId);
      setMessages([
        { sender: 'bot', text: `Great. Let's begin the debate on: ${topic}` },
        { sender: 'bot', text: `You believe: "${summary}" — I will now take the opposing position.` }
      ]);
      startDebate(passedConversationId);
    } else {
      const newId = crypto.randomUUID();
      sessionStorage.setItem("conversationId", newId);
      setConversationId(newId);
      setMessages([{ sender: 'bot', text: "Hello! What would you like to debate today?" }]);
      startDebate(newId);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000); // tick every second
  
    return () => clearInterval(interval);
  }, []);

  // Auto-resize
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  // Auto-scroll
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userText = input;
    setInput('');
    setMessages(prev => [...prev, { sender: 'user', text: userText }, { sender: 'bot', text: 'CONSIDER is typing...' }]);
  
    try {
      const res = await sendDebateChat(conversationId, userText, topic, summary, profile);

  
      const reply = res.data.reply;
      setMessages(prev => [
        ...prev.slice(0, -1),
        { sender: 'bot', text: reply }
      ]);
    } catch (err) {
      console.error('Chat API error:', err);
      setMessages(prev => [
        ...prev.slice(0, -1),
        { sender: 'bot', text: 'I`m tired.....i`m gonna have a nap.' }
      ]);
    }
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

// Delete?
  const handleClear = () => {
    const newId = crypto.randomUUID();
    sessionStorage.setItem("conversationId", newId);
    setConversationId(newId);
    setMessages([{ sender: 'bot', text: "Hello! What would you like to discuss today?" }]);
    setInput('');
  };
  return (
    <div className="chat-container">
      {/* Header */}
      <div className="page-header">
        <span className="page-title">Discussion</span>
      </div>
      <p className="page-subtitle">
        You will now engage in a discussion with an AI that has an opposing opinion to you. Freely discuss the topic, as you would with another person.
      </p>
      <p style={{ textAlign: 'center', fontWeight: 'bold', marginTop: '0.5rem', color: '#444' }}>
        ⏳ Time remaining: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
      </p>
  
      {/* Messages */}
      <div className="chat-box" ref={chatBoxRef}>
        {messages.map((m, i) => (
          <div key={i} className={`message-wrapper ${m.sender}`}>
            {m.sender === 'bot' && (
              <img src="public/robot.png" alt="Bot" className="bot-avatar" />
            )}
            <div className={`message ${m.sender}-message`}>
              {m.text === "DebateBot is typing..." ? (
                <span className="typing-indicator">{m.text}</span>
              ) : (
                m.text
              )}
            </div>
          </div>
        ))}
      </div>
  
      {/* Input */}
      <div className="chat-input-area">
        <textarea
          ref={textareaRef}
          className="chat-input"
          placeholder="Type your argument..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
        />
        <button className="send-button" onClick={handleSend}>Send</button>
      </div>
  
      {/* Clear */}
      {/* <button className="clear-button" onClick={handleClear}>Clear Chat</button> */}
      <div className="proceed-button-wrapper">
        <button className="proceed-button" onClick={() => navigate('/results')}>
          End Debate
        </button>
      </div>
    </div>
  );
}
export default Chat;  