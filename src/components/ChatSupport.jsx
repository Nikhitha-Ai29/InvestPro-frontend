import { useState, useEffect, useRef } from 'react';
import { getResponse } from './chatbotData';
import '../styles/ChatSupport.css';

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081';
const QUICK_PROMPTS = ['What is SIP?', 'Best fund for beginners', 'Low risk funds', 'Expected returns'];

function ChatSupport() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: `👋 Hi! I'm your InvestPro assistant.\n\nAsk me about SIP, mutual funds, returns, or beginner tips!`, sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const sendMessage = async (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    setMessages(prev => [...prev, { text: trimmed, sender: 'user' }]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch(`${API}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed }),
      });
      if (!res.ok) throw new Error('Backend unavailable');
      const data = await res.json();
      const reply = data.reply || data.response || data.message || getResponse(trimmed);
      setMessages(prev => [...prev, { text: reply, sender: 'bot' }]);
    } catch {
      setMessages(prev => [...prev, { text: getResponse(trimmed), sender: 'bot' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
  };

  return (
    <>
      <button
        className={`chat-toggle ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(prev => !prev)}
        aria-label="Toggle chat"
      >
        {isOpen ? '✕' : '💬'}
      </button>

      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <div className="chat-header-info">
              <div className="chat-bot-avatar">🤖</div>
              <div>
                <div className="chat-bot-name">InvestPro Assistant</div>
                <div className="chat-bot-status">● Online</div>
              </div>
            </div>
            <button className="chat-close-btn" onClick={() => setIsOpen(false)}>✕</button>
          </div>

          <div className="chat-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`message ${msg.sender}`}>
                {msg.sender === 'bot' && <div className="bot-icon">🤖</div>}
                <div className="message-bubble">
                  {msg.text.split('\n').map((line, i, arr) => (
                    <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
                  ))}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="message bot">
                <div className="bot-icon">🤖</div>
                <div className="message-bubble typing-indicator">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="quick-prompts">
            {QUICK_PROMPTS.map((prompt, idx) => (
              <button key={idx} className="quick-prompt-btn" onClick={() => sendMessage(prompt)}>
                {prompt}
              </button>
            ))}
          </div>

          <div className="chat-input">
            <input
              type="text"
              placeholder="Ask me anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
            />
            <button className="send-btn" onClick={() => sendMessage(input)} disabled={!input.trim()}>
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default ChatSupport;
