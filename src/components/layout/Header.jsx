import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Moon, Sun, Satellite } from 'lucide-react';

const Header = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full glass border-b border-slate-200/60 dark:border-slate-800/60 transition-colors">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl text-white shadow-lg shadow-blue-500/20">
            <Satellite className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              ISS & News Hub
            </h1>
            <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500 tracking-widest uppercase hidden sm:block">
              Real-Time Dashboard
            </p>
          </div>
        </div>

        <button
          onClick={toggleTheme}
          className="group p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-200 hover:scale-105 active:scale-95"
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform duration-300" />
          ) : (
            <Moon className="w-4 h-4 text-slate-600 group-hover:-rotate-12 transition-transform duration-300" />
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;
