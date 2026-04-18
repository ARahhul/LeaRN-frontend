import React from 'react';
import { Filter, Plus, Search, Mic, MoreVertical, BookOpen, Loader2, Globe, Table, AlertTriangle } from 'lucide-react';
import './SourceVault.css';

const SourceVault = () => {
  return (
    <div className="vault-container fade-in">
      <div className="vault-header">
        <div className="vault-title-group">
          <span className="vault-label">KNOWLEDGE BASE</span>
          <h1 className="vault-title">Source Vault</h1>
          <p className="vault-subtitle">
            Curated primary texts, research papers, and annotated datasets training your personal academic model.
          </p>
        </div>
        <div className="vault-actions">
          <button className="btn-filter">
            <Filter size={18} />
            Filter
          </button>
          <button className="btn-add">
            <Plus size={18} />
            Add Source
          </button>
        </div>
      </div>

      <div className="search-container">
        <Search className="search-icon" size={20} />
        <input 
          type="text" 
          className="search-input" 
          placeholder="Search across all knowledge sources, text, and annotations..." 
        />
        <Mic className="mic-icon" size={20} />
      </div>

      <div className="section-header">
        <h2 className="section-title">Recently Trained</h2>
        <a href="#" className="view-all">View All</a>
      </div>

      <div className="cards-grid">
        {/* Card 1: Large */}
        <div className="card card-large">
          <div className="card-header">
            <div className="card-badges">
              <span className="badge badge-trained">TRAINED</span>
              <span className="badge-meta">PDF • 4.2 MB</span>
            </div>
            <button className="btn-icon"><MoreVertical size={16} /></button>
          </div>
          <div className="card-icon-title">
            <BookOpen className="card-icon" size={24} />
            <div className="card-title">The Structure of Scientific Revolutions</div>
          </div>
          <p className="card-desc">
            Thomas S. Kuhn. Analysis of paradigm shifts and normal science. Highly referenced in Chapter 3 drafts.
          </p>
          <div className="card-footer">
            <span>Last read 2h ago</span>
            <span>124 Citations</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="card">
          <div className="card-header">
            <div className="card-badges">
              <span className="badge badge-processing">
                <Loader2 size={12} className="spin" />
                PROCESSING
              </span>
            </div>
            <button className="btn-icon"><MoreVertical size={16} /></button>
          </div>
          <div className="card-icon-title">
            <BookOpen className="card-icon" size={20} />
            <div className="card-title" style={{ fontSize: '1rem' }}>Neuroplasticity Post-Trauma Clinical Trials 2023</div>
          </div>
          <p className="card-desc" style={{ flex: 'none', marginBottom: '8px' }}>
            A comprehensive overview...
          </p>
          <div className="progress-container">
            <div className="progress-bar-bg">
              <div className="progress-bar-fill"></div>
            </div>
            <div className="progress-status">Extracting entities... 45%</div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="card">
          <div className="card-header">
            <div className="card-badges">
              <span className="badge badge-web">WEB ARTICLE</span>
            </div>
            <button className="btn-icon"><MoreVertical size={16} /></button>
          </div>
          <div className="card-icon-title">
            <Globe className="card-icon" size={20} />
            <div className="card-title" style={{ fontSize: '1rem' }}>Ethical Implications of AGI in Academic...</div>
          </div>
          <p className="card-desc">Nature Journal Editorial.</p>
          <div className="card-footer-tags">
            <span className="tag">Ethics</span>
            <span className="tag">AI</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="card">
          <div className="card-header">
            <div className="card-badges">
              <span className="badge badge-dataset">DATASET • CSV</span>
            </div>
            <button className="btn-icon"><MoreVertical size={16} /></button>
          </div>
          <div className="card-icon-title">
            <Table className="card-icon" size={20} />
            <div className="card-title" style={{ fontSize: '1rem' }}>Global Cognitive Decline Stats 2010-...</div>
          </div>
          <p className="card-desc">Raw data supporting thesis chapter 4.</p>
          <div className="card-footer">
            <span className="warning-text">
              <AlertTriangle size={14} /> Review Needed
            </span>
          </div>
        </div>

        {/* Card 5 - Empty State */}
        <div className="card card-empty">
          <div className="empty-icon">
            <Plus size={24} />
          </div>
          <div className="empty-title">Create Collection</div>
          <div className="empty-desc">
            Group related sources into a dedicated knowledge base.
          </div>
        </div>

      </div>
    </div>
  );
};

export default SourceVault;
