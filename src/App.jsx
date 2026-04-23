import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import AITutor from './pages/AITutor';
import SourceVault from './pages/SourceVault';
import Settings from './pages/Settings';
import Onboarding from './pages/Onboarding';
import History from './pages/History';
import Analytics from './pages/Analytics';
import ExamMode from './pages/ExamMode';
import Notes from './pages/Notes';
import BatchMode from './pages/BatchMode';
import { ToastProvider } from './components/ToastContext';

function App() {
  const [isOnboarded, setIsOnboarded] = useState(
    () => !!localStorage.getItem('user_name')
  );

  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  if (!isOnboarded) {
    return <Onboarding onComplete={() => { setIsOnboarded(true); window.history.replaceState(null, '', '/'); }} />;
  }

  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout toggleTheme={toggleTheme} theme={theme} />}>
            <Route index element={<AITutor />} />
            <Route path="source-vault" element={<SourceVault />} />
            <Route path="settings" element={<Settings />} />
            <Route path="history" element={<History />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="exam-mode" element={<ExamMode />} />
            <Route path="notes" element={<Notes />} />
            <Route path="batch-mode" element={<BatchMode />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
