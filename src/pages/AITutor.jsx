import React, { useState, useRef, useEffect } from 'react';
import { Brain, Plus, Mic, ArrowUp, Settings as SettingsIcon, BookOpen, AlertCircle, Loader2, Image } from 'lucide-react';
import './AITutor.css';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000') + '/query';
const IMAGE_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:8000') + '/images';

function AnswerBlock({ text }) {
  const lines = text.split('\n');

  const renderInline = (str) => {
    const parts = str.split(/\*\*([^*]+)\*\*/g);
    return parts.map((part, j) =>
      j % 2 === 1 ? <strong key={j}>{part}</strong> : part
    );
  };

  return (
    <div className="answer-body">
      {lines.map((line, i) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={i} className="answer-spacer" />;

        if (/^#{1,6}\s/.test(trimmed)) {
          const clean = trimmed.replace(/^#{1,6}\s/, '');
          const level = trimmed.match(/^#+/)[0].length;
          return <p key={i} className={`answer-section-heading level-${level}`}>{renderInline(clean)}</p>;
        }

        if (/^\*\*[^*]+\*\*[:\s]?$/.test(trimmed)) {
          const clean = trimmed.replace(/\*\*/g, '');
          return <p key={i} className="answer-section-heading">{clean}</p>;
        }

        if (/^[-•*]\s/.test(trimmed)) {
          return (
            <li key={i} className="answer-bullet">
              {renderInline(trimmed.replace(/^[-•*]\s/, ''))}
            </li>
          );
        }

        if (/^\d+[.)]\s/.test(trimmed)) {
          return (
            <li key={i} className="answer-numbered">
              {renderInline(trimmed)}
            </li>
          );
        }

        return (
          <p key={i} className="answer-para">
            {renderInline(trimmed)}
          </p>
        );
      })}
    </div>
  );
}

function Lightbox({ src, onClose }) {
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <button className="lightbox-close" onClick={onClose}>✕</button>
      <img
        className="lightbox-img"
        src={src}
        alt="expanded"
        onClick={e => e.stopPropagation()}
      />
    </div>
  );
}

function ResponseCard({ message }) {
  return (
    <div className="response-card fade-in">
      <div className="response-question">
        <span className="response-question-label">Q</span>
        <span>{message.question}</span>
      </div>
      <div className="response-answer">
        <div className="response-answer-header">
          <Brain size={16} />
          <span>VTU Model Answer</span>
        </div>
        <AnswerBlock text={message.answer} />
      </div>
      {message.sources && message.sources.length > 0 && (
        <div className="response-sources">
          <div className="sources-label">Sources Referenced</div>
          <div className="sources-list">
            {message.sources.map((s, i) => (
              <span key={i} className="source-chip">
                <BookOpen size={10} />
                {s.file_name || s.source_type} · {s.subject}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const AITutor = () => {
  const [question, setQuestion] = useState('');
  const [lightboxSrc, setLightboxSrc] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);
  const bottomRef = useRef(null);

  const userName = localStorage.getItem('user_name') || 'Student';
  const [greeting, setGreeting] = useState(() => {
    const isReturning = localStorage.getItem('returning_user');
    if (!isReturning) {
      return `Hi ${userName}, welcome to your prep dashboard!`;
    }
    return `Welcome back, ${userName}`;
  });

  useEffect(() => {
    const isReturning = localStorage.getItem('returning_user');

    if (!isReturning) {
      // First time user — show the static greeting, then mark as returning
      localStorage.setItem('returning_user', 'true');
      return;
    }

    // Returning user — fetch dynamic greeting from Ollama
    const fetchGreeting = async () => {
      try {
        const res = await fetch('http://localhost:11434/api/generate', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true'
          },
          body: JSON.stringify({
            model: 'qwen3-vl:235b-cloud',
            prompt: `Generate a short, warm, single-line greeting for a student named ${userName} who just opened their VTU exam prep dashboard.\nVary the greeting every time — sometimes say welcome back, sometimes say good morning/evening, sometimes say something motivational.\nKeep it under 10 words. Only return the greeting text, nothing else.`,
            stream: false,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          const text = (data.response || '').trim();
          if (text) setGreeting(text);
        }
      } catch {
        // Keep the fallback greeting on error
      }
    };

    fetchGreeting();
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  const handleSubmit = async () => {
    const q = question.trim();
    if (!q || loading) return;

    setLoading(true);
    setError(null);
    setQuestion('');

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
          'bypass-tunnel-reminder': 'true'
        },
        body: JSON.stringify({ question: q }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || `Server error ${res.status}`);
      }

      const data = await res.json();
      setMessages(prev => [...prev, {
        question: q,
        answer: data.answer,
        sources: data.sources,
        images: data.images,
      }]);
    } catch (e) {
      setError(e.message || 'Could not reach the backend. Is it running?');
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const hasMessages = messages.length > 0 || loading || error;
  const allImages = messages.filter(m => m.images && m.images.length > 0);

  return (
    <div className={`ai-tutor-container fade-in ${hasMessages ? 'has-messages' : ''}`}>

      {!hasMessages && (
        <div className="ai-tutor-content">
          <div className="ai-icon-container">
            <Brain size={32} />
          </div>
          <h1 className="ai-heading">{greeting}</h1>
          <p className="ai-subtext">
            Ask me any VTU question and I'll generate a model answer for you, {userName}.
          </p>
        </div>
      )}

      {hasMessages && (
        <div className="messages-feed-wrapper">

          {/* LEFT: chat */}
          <div className="messages-feed">
            {messages.map((msg, i) => (
              <ResponseCard key={i} message={msg} />
            ))}
            {loading && (
              <div className="loading-card fade-in">
                <Loader2 size={18} className="spin" />
                <span>Generating your VTU model answer…</span>
              </div>
            )}
            {error && (
              <div className="error-card fade-in">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* RIGHT: images panel */}
          <div className="images-panel">
            <div className="images-panel-header">
              <Image size={13} />
              <span>Relevant Images</span>
            </div>
            {allImages.length === 0 ? (
              <div className="images-empty">Images will appear here after a query</div>
            ) : (
              allImages.map((msg, i) => (
                <div key={i} className="images-group">
                  <div className="images-group-label">Q{i + 1} · {msg.images.length} image{msg.images.length > 1 ? 's' : ''}</div>
                  {msg.images.map((img, j) => (
                    <img
                      key={j}
                      src={`${IMAGE_BASE}/${img}?ngrok-skip-browser-warning=true`}
                      alt={`relevant-${j}`}
                      className="answer-image"
                      onClick={() => setLightboxSrc(`${IMAGE_BASE}/${img}?ngrok-skip-browser-warning=true`)}
                      onError={(e) => e.target.style.display = 'none'}
                    />
                  ))}
                </div>
              ))
            )}
          </div>

        </div>
      )}

      {/* Input bar */}
      <div className="input-container-wrapper">
        <div className="input-bar">
          <button className="btn-icon hide-mobile" title="Attach">
            <Plus size={20} />
          </button>
          <input
            ref={inputRef}
            type="text"
            className="ai-input"
            placeholder="Ask a VTU question… (e.g. Explain ACID properties 10 marks)"
            value={question}
            onChange={e => setQuestion(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />
          <button className="btn-icon hide-mobile" title="Voice">
            <Mic size={20} />
          </button>
          <button
            className="btn-send"
            onClick={handleSubmit}
            disabled={loading || !question.trim()}
            title="Send"
          >
            {loading ? <Loader2 size={20} className="spin" /> : <ArrowUp size={20} />}
          </button>
        </div>
        <div className="footer-text">
          <span>AI TUTOR CAN MAKE MISTAKES. VERIFY CRITICAL CLAIMS.</span>
          <span>MODEL: SCHOLAR-V2 <SettingsIcon size={12} /></span>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxSrc && <Lightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />}
    </div>
  );
};

export default AITutor;
