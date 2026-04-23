import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Library, Brain, Settings, HelpCircle, LogOut, Menu, X, Moon, Sun, History, LayoutDashboard, Award, FileText, Notebook } from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ toggleTheme, theme }) => {
  const [userName, setUserName] = useState('');
  const [isOpen, setIsOpen] = useState(false);
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

  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      <button className="mobile-menu-btn" onClick={() => setIsOpen(true)}>
        <Menu size={24} />
      </button>

      {isOpen && <div className="sidebar-overlay" onClick={closeSidebar} />}

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <span style={{ fontWeight: 'bold', fontFamily: 'var(--font-serif)' }}>L</span>
          </div>
          <div className="sidebar-title-container">
            <div className="sidebar-title">LeaRN</div>
          </div>
          <button className="mobile-close-btn" onClick={closeSidebar}>
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/source-vault" onClick={closeSidebar} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Library className="nav-icon" />
            SOURCE VAULT
          </NavLink>
          <NavLink to="/" end onClick={closeSidebar} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Brain className="nav-icon" />
            AI TUTOR
          </NavLink>
          <NavLink to="/history" onClick={closeSidebar} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <History className="nav-icon" />
            HISTORY
          </NavLink>
          <NavLink to="/analytics" onClick={closeSidebar} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <LayoutDashboard className="nav-icon" />
            ANALYTICS
          </NavLink>
          <NavLink to="/exam-mode" onClick={closeSidebar} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Award className="nav-icon" />
            EXAM MODE
          </NavLink>
          <NavLink to="/batch-mode" onClick={closeSidebar} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <FileText className="nav-icon" />
            BATCH MODE
          </NavLink>
          <NavLink to="/notes" onClick={closeSidebar} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Notebook className="nav-icon" />
            NOTES
          </NavLink>
          <NavLink to="/settings" onClick={closeSidebar} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Settings className="nav-icon" />
            SETTINGS
          </NavLink>
        </nav>

        <div className="sidebar-bottom">
          <button
            className="bottom-link theme-toggle"
            onClick={toggleTheme}
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          >
            {theme === 'light' ? <Moon size={14} /> : <Sun size={14} />}
            {theme === 'light' ? 'DARK MODE' : 'LIGHT MODE'}
          </button>
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
    </>
  );
};

export default Sidebar;
