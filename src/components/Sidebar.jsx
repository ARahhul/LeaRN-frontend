import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FileText, Library, Brain, Settings, HelpCircle, LogOut } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setUserName(localStorage.getItem('user_name') || '');
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_college');
    window.location.href = '/';
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <span style={{ fontWeight: 'bold', fontFamily: 'var(--font-serif)' }}>L</span>
        </div>
        <div className="sidebar-title-container">
          <div className="sidebar-title">LeaRN</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/source-vault" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Library className="nav-icon" />
          SOURCE VAULT
        </NavLink>
        <NavLink to="/" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Brain className="nav-icon" />
          AI TUTOR
        </NavLink>
        <NavLink to="/settings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Settings className="nav-icon" />
          SETTINGS
        </NavLink>
      </nav>

      <div className="sidebar-bottom">
        <div className="bottom-links">
          <a href="#" className="bottom-link">
            <HelpCircle size={14} />
            HELP
          </a>
          <button className="bottom-link logout-link" onClick={handleLogout}>
            <LogOut size={14} />
            LOGOUT
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
