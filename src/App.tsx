import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { TopicSelector } from './components/TopicSelector';
import { QuizView } from './components/QuizView';
import { ResultSummary } from './components/ResultSummary';
import { StudyBrowser } from './components/StudyBrowser';
import { Question, UserAnswer, QuizMode } from './types';
import { GES107_QUESTIONS } from './data/ges107Questions';
import { buildStandaloneHtml } from './utils/generateOfflineHtml';

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ges107_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const [currentView, setCurrentView] = useState<'topics' | 'quiz' | 'summary' | 'browser'>('topics');
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<Record<number, UserAnswer>>({});
  const [timeTakenSeconds, setTimeTakenSeconds] = useState<number>(0);
  const [quizMode, setQuizMode] = useState<QuizMode>('practice');
  const [timerMinutes, setTimerMinutes] = useState<number>(30);

  // Sync dark class to html
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('ges107_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('ges107_theme', 'light');
    }
  }, [darkMode]);

  const handleToggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  const handleStartQuiz = (config: {
    selectedTopicIds: string[];
    mode: QuizMode;
    questionCount: number;
    shuffleQuestions: boolean;
    timerMinutes: number;
  }) => {
    let pool: Question[] = [];

    if (config.selectedTopicIds.includes('all')) {
      pool = [...GES107_QUESTIONS];
    } else {
      pool = GES107_QUESTIONS.filter(q => config.selectedTopicIds.includes(q.topicId));
    }

    if (config.shuffleQuestions) {
      pool = [...pool].sort(() => 0.5 - Math.random());
    }

    const selectedSlice = pool.slice(0, config.questionCount);
    setActiveQuestions(selectedSlice);
    setUserAnswers({});
    setTimeTakenSeconds(0);
    setQuizMode(config.mode);
    setTimerMinutes(config.timerMinutes);
    setCurrentView('quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinishQuiz = (answers: Record<number, UserAnswer>, elapsed: number) => {
    setUserAnswers(answers);
    setTimeTakenSeconds(elapsed);
    setCurrentView('summary');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRetakeAll = () => {
    setUserAnswers({});
    setTimeTakenSeconds(0);
    setCurrentView('quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRetakeMissed = (missedQuestions: Question[]) => {
    setActiveQuestions(missedQuestions);
    setUserAnswers({});
    setTimeTakenSeconds(0);
    setCurrentView('quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDownloadOfflineHtml = () => {
    const htmlContent = buildStandaloneHtml(GES107_QUESTIONS);
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ges107_interactive_quiz_cbt.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleStartQuizWithTopic = (topicId: string) => {
    handleStartQuiz({
      selectedTopicIds: [topicId],
      mode: 'practice',
      questionCount: 50,
      shuffleQuestions: true,
      timerMinutes: 30
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      <Header
        darkMode={darkMode}
        onToggleDarkMode={handleToggleDarkMode}
        currentView={currentView}
        onNavigate={view => {
          if (currentView === 'quiz') {
            if (window.confirm('Leave active quiz session? Progress will be lost.')) {
              setCurrentView(view);
            }
          } else {
            setCurrentView(view);
          }
        }}
        onDownloadOfflineHtml={handleDownloadOfflineHtml}
        quizActive={currentView === 'quiz'}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
        {currentView === 'topics' && (
          <TopicSelector
            onStartQuiz={handleStartQuiz}
            onOpenBrowser={() => setCurrentView('browser')}
            onDownloadHtml={handleDownloadOfflineHtml}
          />
        )}

        {currentView === 'quiz' && (
          <QuizView
            questions={activeQuestions}
            mode={quizMode}
            timerMinutes={timerMinutes}
            onFinish={handleFinishQuiz}
            onExit={() => setCurrentView('topics')}
          />
        )}

        {currentView === 'summary' && (
          <ResultSummary
            questions={activeQuestions}
            userAnswers={userAnswers}
            timeTakenSeconds={timeTakenSeconds}
            onRetakeAll={handleRetakeAll}
            onRetakeMissed={handleRetakeMissed}
            onBackToTopics={() => setCurrentView('topics')}
          />
        )}

        {currentView === 'browser' && (
          <StudyBrowser onStartQuizWithTopic={handleStartQuizWithTopic} />
        )}
      </main>

      {/* Clean, quiet footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/50 py-6 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700 dark:text-slate-300">GES 107</span>
            <span>·</span>
            <span>Reproductive Health, STIs, HIV/AIDS & Nutrition</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleDownloadOfflineHtml}
              className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
            >
              Export Standalone HTML
            </button>
            <span>·</span>
            <span>University of Ibadan Curriculum</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
