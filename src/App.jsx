import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import AITutor from './pages/AITutor';
import SourceVault from './pages/SourceVault';
import Settings from './pages/Settings';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<AITutor />} />
          <Route path="source-vault" element={<SourceVault />} />
          <Route path="settings" element={<Settings />} />
          {/* Mock routes for other sidebar items to avoid 404s, pointing to AITutor for now or just a placeholder */}
          <Route path="workbench" element={<div className="fade-in" style={{padding: '40px'}}><h2>Workbench (Coming Soon)</h2></div>} />
          <Route path="notes" element={<div className="fade-in" style={{padding: '40px'}}><h2>Research Notes (Coming Soon)</h2></div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
