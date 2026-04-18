import React from 'react';
import { Brain, Plus, Mic, ArrowUp, Settings as SettingsIcon } from 'lucide-react';
import './AITutor.css';

const AITutor = () => {
  return (
    <div className="ai-tutor-container fade-in">
      <div className="ai-tutor-content">
        <div className="ai-icon-container">
          <Brain size={32} />
        </div>
        <h1 className="ai-heading">How can I assist your research today?</h1>
        <p className="ai-subtext">
          I have access to your Source Vault. You can ask me to synthesize documents, draft thesis statements, or challenge your arguments.
        </p>
        
        <div className="suggestions-grid">
          <button className="suggestion-pill">Summarize recent notes</button>
          <button className="suggestion-pill">Draft literature review structure</button>
          <button className="suggestion-pill">Find opposing viewpoints</button>
        </div>
      </div>

      <div className="input-container-wrapper">
        <div className="input-bar">
          <button className="btn-icon">
            <Plus size={20} />
          </button>
          <input 
            type="text" 
            className="ai-input" 
            placeholder="Ask a question or request analysis..." 
          />
          <button className="btn-icon">
            <Mic size={20} />
          </button>
          <button className="btn-send">
            <ArrowUp size={20} />
          </button>
        </div>
        
        <div className="footer-text">
          <span>AI TUTOR CAN MAKE MISTAKES. VERIFY CRITICAL CLAIMS.</span>
          <span>MODEL: SCHOLAR-V2 <SettingsIcon size={12} /></span>
        </div>
      </div>
    </div>
  );
};

export default AITutor;
