import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, Library, Brain, Settings } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <span style={{ fontWeight: 'bold', fontFamily: 'var(--font-serif)' }}>A</span>
        </div>
        <div className="sidebar-title-container">
          <div className="sidebar-title">The Atelier</div>
          <div className="sidebar-subtitle">GRADUATE RESEARCH</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {/* We can map over links to keep it DRY or write them out */}
        <NavLink to="/workbench" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <LayoutDashboard className="nav-icon" />
          WORKBENCH
        </NavLink>
        <NavLink to="/notes" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <FileText className="nav-icon" />
          RESEARCH NOTES
        </NavLink>
        <NavLink to="/source-vault" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Library className="nav-icon" />
          SOURCE VAULT
        </NavLink>
        <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Brain className="nav-icon" />
          AI TUTOR
        </NavLink>
        <NavLink to="/settings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Settings className="nav-icon" />
          SETTINGS
        </NavLink>
      </nav>

      <div className="sidebar-bottom">
        <button className="btn-upgrade">
          UPGRADE TO SCHOLAR
        </button>
        <div className="bottom-links">
          <a href="#" className="bottom-link">HELP</a>
          <a href="#" className="bottom-link">LOGOUT</a>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
