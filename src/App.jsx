import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import { DashboardProvider, useDashboardData } from './context/DashboardContext';
import DashboardLayout from './components/layout/DashboardLayout';
import ISSTracker from './components/iss/ISSTracker';
import NewsDashboard from './components/news/NewsDashboard';

import { AlertTriangle } from 'lucide-react';

const EnvWarning = () => {
  const missingNews = !import.meta.env.VITE_NEWS_API_KEY;
  const missingAI = !import.meta.env.VITE_AI_TOKEN;

  if (!missingNews && !missingAI) return null;

  return (
    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200/60 dark:border-amber-800/40 text-amber-800 dark:text-amber-200 px-4 py-3 rounded-2xl flex items-start sm:items-center gap-3 w-full animate-fade-in-up">
      <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5 sm:mt-0 text-amber-500" />
      <div className="text-sm leading-relaxed">
        <span className="font-bold">Configuration Required: </span>
        Create a <code className="bg-amber-200/60 dark:bg-amber-800/40 px-1.5 py-0.5 rounded-md text-xs font-mono">.env</code> file from <code className="bg-amber-200/60 dark:bg-amber-800/40 px-1.5 py-0.5 rounded-md text-xs font-mono">.env.example</code> and restart the server to enable {missingNews && missingAI ? 'News and AI Chatbot' : missingNews ? 'News functionality' : 'the AI Chatbot'}.
      </div>
    </div>
  );
};

const MainDashboard = () => {
  const { issData, newsData } = useDashboardData();

  return (
    <DashboardLayout>
      <EnvWarning />
      <div className="space-y-6 mt-2">
        <section className="animate-fade-in-up">
          <ISSTracker issData={issData} />
        </section>

        {/* Section Divider */}
        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-700 to-transparent" />
          </div>
        </div>

        <section className="animate-fade-in-up delay-200">
          <NewsDashboard newsData={newsData} />
        </section>
      </div>
    </DashboardLayout>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <DashboardProvider>
        <Router>
          <Toaster 
            position="top-right" 
            toastOptions={{
              className: 'dark:bg-slate-800 dark:text-white border border-slate-200/60 dark:border-slate-700/60 shadow-xl rounded-xl text-sm',
              duration: 3000,
            }} 
          />
          <Routes>
            <Route path="/" element={<MainDashboard />} />
          </Routes>
        </Router>
      </DashboardProvider>
    </ThemeProvider>
  );
};

export default App;
