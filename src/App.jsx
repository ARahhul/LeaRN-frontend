import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import AITutor from './pages/AITutor';
import SourceVault from './pages/SourceVault';
import Settings from './pages/Settings';
import Onboarding from './pages/Onboarding';

function App() {
  const [isOnboarded, setIsOnboarded] = useState(
    () => !!localStorage.getItem('user_name')
  );

  if (!isOnboarded) {
    return <Onboarding onComplete={() => { setIsOnboarded(true); window.history.replaceState(null, '', '/'); }} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<AITutor />} />
          <Route path="source-vault" element={<SourceVault />} />
          <Route path="settings" element={<Settings />} />
          <Route path="notes" element={<div className="fade-in" style={{padding: '40px'}}><h2>Research Notes (Coming Soon)</h2></div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
