import React from 'react';
import { BookOpen, Moon, Sun, Download, Award, Search, ListFilter } from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  currentView: 'topics' | 'quiz' | 'summary' | 'browser';
  onNavigate: (view: 'topics' | 'browser') => void;
  onDownloadOfflineHtml: () => void;
  quizActive: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  onToggleDarkMode,
  currentView,
  onNavigate,
  onDownloadOfflineHtml,
  quizActive
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('topics')}
            className="flex items-center gap-2 text-left group"
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-sm shadow-sm group-hover:bg-emerald-700 transition-colors">
              GES
            </div>
            <div>
              <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white block leading-tight">
                GES 107 CBT Prep
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                Reproductive Health, STIs & Nutrition
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="flex items-center gap-1 sm:gap-2 text-sm font-medium">
          <button
            onClick={() => onNavigate('topics')}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm transition-colors ${
              currentView === 'topics' && !quizActive
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <ListFilter className="w-4 h-4" />
              <span>Practice & Exams</span>
            </span>
          </button>

          <button
            onClick={() => onNavigate('browser')}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm transition-colors ${
              currentView === 'browser'
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Search className="w-4 h-4" />
              <span>Question Bank</span>
            </span>
          </button>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onDownloadOfflineHtml}
            title="Download Standalone Offline HTML File"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Offline HTML</span>
          </button>

          <button
            onClick={onToggleDarkMode}
            aria-label="Toggle dark mode"
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>
        </div>
      </div>
    </header>
  );
};
