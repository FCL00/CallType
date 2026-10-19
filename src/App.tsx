import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { AccountPage } from './pages/AccountPage';
import { PracticePage } from './pages/PracticePage';
import { ResultsPage } from './pages/ResultsPage';
import { initSessionLifecycleCleanup } from './lib/session-storage';

// Helper to scroll smoothly to hash anchors or top on route change
function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname, hash]);

  return null;
}

export default function App() {
  useEffect(() => {
    // Setup centralized demo session lifecycle listener
    const cleanup = initSessionLifecycleCleanup();
    return () => cleanup();
  }, []);

  return (
    <BrowserRouter>
      <ScrollManager />
      <div className="min-h-screen flex flex-col bg-[#fafaf9] text-stone-900 font-sans selection:bg-emerald-500/20 selection:text-emerald-900">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/app" element={<DashboardPage />} />
            <Route path="/app/accounts/:category" element={<AccountPage />} />
            <Route path="/app/practice/:scenarioId" element={<PracticePage />} />
            <Route path="/app/results/:sessionId" element={<ResultsPage />} />
            {/* Catch-all redirect to /app */}
            <Route path="*" element={<DashboardPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
