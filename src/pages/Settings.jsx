import React, { useState } from 'react';
import { User } from 'lucide-react';
import './Settings.css';

const Settings = () => {
  const [name, setName] = useState(() => localStorage.getItem('user_name') || '');
  const [email, setEmail] = useState(() => localStorage.getItem('user_email') || '');
  const [college, setCollege] = useState(() => localStorage.getItem('user_college') || '');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    localStorage.setItem('user_name', name.trim());
    localStorage.setItem('user_email', email.trim());
    localStorage.setItem('user_college', college.trim());
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="settings-container fade-in">
      <div className="settings-header">
        <h1 className="settings-title">Settings</h1>
        <p className="settings-subtitle">Manage your profile information.</p>
      </div>

      <div className="settings-content">
        <div className="settings-sidebar">
          <button className="settings-tab active">Profile Information</button>
        </div>

        <div className="settings-main">
          <div className="settings-section">
            <h2 className="section-heading">Profile Information</h2>

            <div className="profile-header">
              <div className="avatar-container">
                <User size={40} />
              </div>
              <div className="profile-info">
                <h3>{name || 'Your Name'}</h3>
                <p>{email || 'your@email.com'}</p>
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group full-width">
                <label className="form-label">FULL NAME</label>
                <input
                  type="text"
                  className="form-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="form-group full-width">
                <label className="form-label">GMAIL</label>
                <input
                  type="email"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="form-group full-width">
                <label className="form-label">COLLEGE / INSTITUTION</label>
                <input
                  type="text"
                  className="form-input"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                />
              </div>
            </div>

            <div className="form-actions">
              {saved && <span className="save-toast">✓ Saved</span>}
              <button className="btn-save" onClick={handleSave}>Save Changes</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
