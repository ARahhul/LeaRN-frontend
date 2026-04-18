import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import './Layout.css';

const Layout = () => {
  const location = useLocation();
  
  return (
    <>
      <Sidebar />
      <main className="main-content">
        {/* We use location.pathname as a key to force re-render and re-trigger the fade-in animation */}
        <div key={location.pathname} className="page-wrapper fade-in">
          <Outlet />
        </div>
      </main>
    </>
  );
};

export default Layout;
