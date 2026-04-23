import React, { useState, useEffect } from 'react';
import './History.css';

const History = () => {
  const [history, setHistory] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('query_log') || '[]');
    setHistory([...stored].reverse());
  }, []);

  return (
    <div className="history-container">
      <div className="history-list">
        <div className="history-list-header">Query History</div>
        {history.length === 0 && (
          <div className="history-empty">No history yet. Ask a question first!</div>
        )}
        {history.map((entry, i) => (
          <div
            key={i}
            className={`history-item ${selected === entry ? 'history-item-active' : ''}`}
            onClick={() => setSelected(entry)}
          >
            <div className="history-item-question">{entry.question}</div>
            <div className="history-item-meta">
              <span>{entry.subject || 'All'}</span>
              <span>{entry.timeTaken}s</span>
              <span>{new Date(entry.timestamp).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="history-detail">
        {!selected ? (
          <div className="history-detail-empty">
            Select a question from the left to view the answer
          </div>
        ) : (
          <div className="history-detail-content">
            <div className="history-detail-question">{selected.question}</div>
            <div className="history-detail-meta">
              <span className="history-badge">{selected.subject || 'All'}</span>
              <span>{selected.timeTaken}s response time</span>
              <span>{new Date(selected.timestamp).toLocaleString()}</span>
            </div>
            <div className="history-detail-answer">
              {selected.answer
                ? selected.answer
                : 'Answer not available for this entry. Ask the question again from AI Tutor to save the full answer.'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
