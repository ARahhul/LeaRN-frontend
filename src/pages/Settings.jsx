import React from 'react';
import { User, Pencil } from 'lucide-react';
import './Settings.css';

const Settings = () => {
  return (
    <div className="settings-container fade-in">
      <div className="settings-header">
        <h1 className="settings-title">Settings</h1>
        <p className="settings-subtitle">Manage your profile, preferences, and subscription.</p>
      </div>

      <div className="settings-content">
        <div className="settings-sidebar">
          <button className="settings-tab active">Profile Information</button>
          <button className="settings-tab">Subscription & Usage</button>
          <button className="settings-tab">App Preferences</button>
          <button className="settings-tab">Security</button>
        </div>

        <div className="settings-main">
          {/* Profile Section */}
          <div className="settings-section">
            <h2 className="section-heading">Profile Information</h2>
            
            <div className="profile-header">
              <div className="avatar-container">
                <User size={40} />
                <button className="avatar-edit">
                  <Pencil size={14} />
                </button>
              </div>
              <div className="profile-info">
                <h3>Dr. Elena Rostova</h3>
                <p>elena.rostova@university.edu</p>
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">FIRST NAME</label>
                <input type="text" className="form-input" defaultValue="Elena" />
              </div>
              <div className="form-group">
                <label className="form-label">LAST NAME</label>
                <input type="text" className="form-input" defaultValue="Rostova" />
              </div>
              <div className="form-group full-width">
                <label className="form-label">INSTITUTION/AFFILIATION</label>
                <input type="text" className="form-input" defaultValue="Department of Comparative Literature" />
              </div>
              <div className="form-group full-width">
                <label className="form-label">RESEARCH FOCUS</label>
                <textarea 
                  className="form-textarea" 
                  defaultValue="Focusing on post-modern narratives and their intersection with digital archiving methods."
                />
              </div>
            </div>
            
            <div className="form-actions">
              <button className="btn-save">Save Changes</button>
            </div>
          </div>

          {/* Subscription Section (Hint) */}
          <div className="settings-section hint-section">
            <h2 className="section-heading">Subscription & Usage</h2>
            {/* Scroll hint content could go here, but for now just the heading to match design */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
