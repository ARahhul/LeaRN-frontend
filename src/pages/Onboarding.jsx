import React, { useState } from 'react';
import { Brain } from 'lucide-react';
import './Onboarding.css';

const Onboarding = ({ onComplete }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [college, setCollege] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !college.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    localStorage.setItem('user_name', name.trim());
    localStorage.setItem('user_email', email.trim());
    localStorage.setItem('user_college', college.trim());

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      await fetch(`${API_URL}/onboard`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          college: college.trim()
        })
      });
    } catch (err) {
      console.error('Failed to save onboard data to backend:', err);
    }

    onComplete();
  };

  return (
    <div className="onboarding-backdrop">
      <div className="onboarding-card fade-in">
        <div className="onboarding-logo">
          <Brain size={28} />
        </div>
        <h1 className="onboarding-heading">Welcome to LeaRN</h1>
        <p className="onboarding-subtext">
          Your AI-powered VTU study companion. Enter your details to get started.
        </p>

        <form className="onboarding-form" onSubmit={handleSubmit}>
          <div className="onboarding-field">
            <label className="onboarding-label">FULL NAME</label>
            <input
              type="text"
              className="onboarding-input"
              placeholder="e.g. A Rahhul Nandhan"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="onboarding-field">
            <label className="onboarding-label">GMAIL ADDRESS</label>
            <input
              type="email"
              className="onboarding-input"
              placeholder="e.g. karthik@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="onboarding-field">
            <label className="onboarding-label">COLLEGE / INSTITUTION</label>
            <input
              type="text"
              className="onboarding-input"
              placeholder="e.g. CMRIT, Bengaluru"
              value={college}
              onChange={(e) => setCollege(e.target.value)}
            />
          </div>

          {error && <p className="onboarding-error">{error}</p>}

          <button type="submit" className="onboarding-btn">Get Started</button>
        </form>

        <p className="onboarding-footer">
          AI TUTOR CAN MAKE MISTAKES. VERIFY CRITICAL CLAIMS.
        </p>
      </div>
    </div>
  );
};

export default Onboarding;
