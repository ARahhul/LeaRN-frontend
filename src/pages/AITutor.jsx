import React, { useState, useRef, useEffect } from 'react';
import { Brain, Plus, Mic, ArrowUp, Settings as SettingsIcon, BookOpen, AlertCircle, Loader2, Image, Download } from 'lucide-react';
import { useToast } from '../components/ToastContext';
import './AITutor.css';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000') + '/query';

function AnswerBlock({ text }) {
  // Clean raw symbols before rendering
  const cleaned = text
    .replace(/---/g, '')                          // remove horizontal rules
    .replace(/\$\\rightarrow\$/g, '→')            // LaTeX arrow to unicode
    .replace(/\$\\Rightarrow\$/g, '⇒')            // LaTeX double arrow
    .replace(/\\\$/g, '₹')                        // escaped dollar to rupee
    .replace(/\$([^$]+)\$/g, '$1')                // strip remaining LaTeX $ wrappers
    .replace(/\\rightarrow/g, '→')                // bare rightarrow
    .replace(/\\Rightarrow/g, '⇒')               // bare Rightarrow
    .replace(/\\_/g, '_')                         // escaped underscore
    .replace(/\\textbf\{([^}]+)\}/g, '$1')        // LaTeX bold
    .replace(/\\text\{([^}]+)\}/g, '$1')          // LaTeX text
    .trim();

  const lines = cleaned.split('\n');

  const renderInline = (str) => {
    const parts = str.split(/\*\*([^*]+)\*\*|\*([^*]+)\*/g);
    return parts.map((part, j) => {
      if (part === undefined) return null;
      if (j % 3 === 1 || j % 3 === 2) return <strong key={j}>{part}</strong>;
      return part;
    });
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

        // Skip table separator lines like | :--- | :--- |
        if (/^\|[\s:|-]+\|/.test(trimmed)) return null;

        // Render table rows as styled paragraphs
        if (/^\|.+\|$/.test(trimmed)) {
          const cells = trimmed.split('|').filter(s => s.trim() !== '');
          return (
            <div key={i} className="answer-table-row">
              {cells.map((cell, ci) => (
                <span key={ci} className="answer-table-cell">{renderInline(cell.trim())}</span>
              ))}
            </div>
          );
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

function ResponseCard({ message, onRelatedClick }) {
  const [rating, setRating] = useState(0);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const ratings = JSON.parse(localStorage.getItem('answer_ratings') || '{}');
    if (message.id && ratings[message.id]) {
      setRating(ratings[message.id]);
      setFeedbackSent(true);
    }
  }, [message.id]);

  const handleRating = (val) => {
    setRating(val);
    setFeedbackSent(true);
    const ratings = JSON.parse(localStorage.getItem('answer_ratings') || '{}');
    if (message.id) {
      ratings[message.id] = val;
      localStorage.setItem('answer_ratings', JSON.stringify(ratings));
    }
  };

  const downloadPDF = async () => {
    if (!cardRef.current) return;
    try {
      const text = message.answer || '';
      const blob = new Blob([`Question: ${message.question}\n\nAnswer:\n${text}`], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `VTU_Answer_${message.id || 'export'}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Failed to export:', e);
    }
  };

  return (
    <div className="response-card fade-in" ref={cardRef}>
      <div className="response-question">
        <span className="response-question-label">Q</span>
        <span>{message.question}</span>
        <div className="response-question-badges">
          {message.marks && (
            <span className="response-marks-badge">{message.marks}</span>
          )}
          {message.confidence !== undefined && (
            <span className={`response-confidence-badge ${message.confidence < 50 ? 'low' : ''}`}>
              Confidence: {Math.round(message.confidence)}%
            </span>
          )}
          <button className="download-pdf-btn" onClick={downloadPDF} title="Download as PDF">
            <Download size={14} />
          </button>
        </div>
      </div>
      <div className="response-meta">
        <span className="response-subject">{message.subject}</span>
        <span className="response-time">⏱ {message.timeTaken}s</span>
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
      {message.related && message.related.length > 0 && (
        <div className="response-related">
          <div className="related-label">Related PYQs</div>
          <div className="related-list">
            {message.related.map((rel, i) => (
              <div key={i} className="related-item" onClick={() => onRelatedClick(rel)}>
                {rel}
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="response-rating">
        <span className="rating-label">Was this helpful?</span>
        <div className="rating-stars">
          {[1, 2, 3, 4, 5].map(star => (
            <span
              key={star}
              className={`star ${rating >= star ? 'active' : ''}`}
              onClick={() => handleRating(star)}
            >
              ★
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

const AITutor = () => {
  const [question, setQuestion] = useState('');
  const [subject, setSubject] = useState('');
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
      localStorage.setItem('returning_user', 'true');
      return;
    }

    const fetchGreeting = async () => {
      try {
        const res = await fetch(API_URL.replace('/query', '/generate'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
            'bypass-tunnel-reminder': 'true'
          },
          body: JSON.stringify({
            model: 'glm-5:cloud',
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

    const lastQuery = localStorage.getItem('last_clicked_query');
    if (lastQuery) {
      const { question: q, subject: s } = JSON.parse(lastQuery);
      setQuestion(q);
      setSubject(s);
      localStorage.removeItem('last_clicked_query');
    }
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

    const startTime = Date.now();

    try {
      // Use the NEW streaming endpoint
      const streamUrl = API_URL.replace('/query', '/query/stream');
      const response = await fetch(streamUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
          'bypass-tunnel-reminder': 'true'
        },
        body: JSON.stringify({ question: q, subject: subject || null, user_name: userName }),
      });

      if (!response.ok) {
        throw new Error(`Server error ${response.status}`);
      }

      // Prepare a new message object for streaming
      const newMsgId = Date.now();
      setMessages(prev => [...prev, {
        id: newMsgId,
        question: q,
        answer: '',
        sources: [],
        images: [],
        subject: subject || 'All',
        timeTaken: '...',
        marks: null,
      }]);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedAnswer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n\n');

        for (const line of lines) {
          if (!line.trim() || line.trim() === 'data: [DONE]') continue;

          if (line.startsWith('data: ')) {
            const dataStr = line.substring(6);
            try {
              const parsed = JSON.parse(dataStr);

              if (parsed.chunk) {
                accumulatedAnswer += parsed.chunk;
                setMessages(prev => prev.map(m =>
                  m.id === newMsgId ? { ...m, answer: accumulatedAnswer } : m
                ));
              } else if (parsed.sources) {
                setMessages(prev => prev.map(m =>
                  m.id === newMsgId ? {
                    ...m,
                    sources: parsed.sources,
                    images: (parsed.images || []).map(imgPath => `${import.meta.env.VITE_API_URL}/images/${imgPath}?ngrok-skip-browser-warning=true`),
                    marks: parsed.marks,
                    confidence: parsed.confidence,
                    related: parsed.related
                  } : m
                ));
              }
            } catch (e) {
              console.error('Error parsing stream chunk:', e, dataStr);
            }
          }
        }
      }

      const duration = ((Date.now() - startTime) / 1000).toFixed(1);
      setMessages(prev => prev.map(m =>
        m.id === newMsgId ? { ...m, timeTaken: duration } : m
      ));

      // Save to query_log
      const queryLog = JSON.parse(localStorage.getItem('query_log') || '[]');
      queryLog.push({
        question: q,
        subject: subject || 'All',
        timeTaken: duration,
        answer: accumulatedAnswer,
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem('query_log', JSON.stringify(queryLog));


    } catch (e) {
      setError(e.message || 'Could not reach the backend.');
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const startVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Your browser does not support voice input.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onstart = () => {
      setLoading(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setQuestion(transcript);
      setLoading(false);
    };

    recognition.onerror = (event) => {
      console.error('Voice input error:', event.error);
      setLoading(false);
    };

    recognition.onend = () => {
      setLoading(false);
    };

    recognition.start();
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

          <div className="messages-feed">
            {messages.map((msg, i) => (
              <ResponseCard
                key={msg.id || i}
                message={msg}
                onRelatedClick={(q) => {
                  setQuestion(q);
                  handleSubmit();
                }}
              />
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
                      src={img}
                      alt={`relevant-${j}`}
                      className="answer-image"
                      onClick={() => setLightboxSrc(img)}
                      onError={(e) => console.error('IMG FAILED:', e.target.src.substring(0, 50))}
                      onLoad={() => console.log('IMG LOADED OK')}
                    />
                  ))}
                </div>
              ))
            )}
          </div>

        </div>
      )}

      <div className="input-container-wrapper">
        <div className="input-bar">
          <select
            className="subject-select"
            value={subject}
            onChange={e => setSubject(e.target.value)}
            disabled={loading}
          >
            <option value="">All Subjects</option>
            <option value="BCS401">BCS401</option>
            <option value="BCS403">BCS403</option>
            <option value="BCS405A">BCS405A</option>
            <option value="BBOC407">BBOC407</option>
            <option value="BUHK408">BUHK408</option>
            <option value="BAD401">BAD401</option>
          </select>
          <button className="btn-icon" title="Upload" aria-label="Upload">
            <Plus size={20} />
          </button>
          <input
            ref={inputRef}
            type="text"
            className="ai-input"
            placeholder="Ask a VTU question (e.g. ACID properties)"
            value={question}
            onChange={e => setQuestion(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />
          <button
            className="btn-icon hide-mobile"
            title="Voice"
            onClick={startVoiceInput}
            disabled={loading}
          >
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

      {lightboxSrc && <Lightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />}
    </div>
  );
};

export default AITutor;
