import React, { useState, useEffect } from 'react';
import { Question, UserAnswer, QuizMode } from '../types';
import {
  ChevronLeft,
  ChevronRight,
  Bookmark,
  CheckCircle,
  XCircle,
  HelpCircle,
  Clock,
  LayoutGrid,
  RotateCcw,
  Send,
  ArrowLeft
} from 'lucide-react';
import { QuestionPalette } from './QuestionPalette';

interface QuizViewProps {
  questions: Question[];
  mode: QuizMode;
  timerMinutes: number;
  onFinish: (answers: Record<number, UserAnswer>, timeTakenSeconds: number) => void;
  onExit: () => void;
}

export const QuizView: React.FC<QuizViewProps> = ({
  questions,
  mode,
  timerMinutes,
  onFinish,
  onExit
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, UserAnswer>>({});
  const [paletteOpen, setPaletteOpen] = useState<boolean>(false);
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState<number>(timerMinutes * 60);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [showExplanationManual, setShowExplanationManual] = useState<boolean>(false);

  // Timer loop
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);

      if (mode === 'exam') {
        setTimeRemainingSeconds(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [mode]);

  const handleAutoSubmit = () => {
    onFinish(userAnswers, elapsedSeconds);
  };

  const currentQ = questions[currentIndex];
  const currentAnswer = userAnswers[currentQ.id];
  const hasAnswered = currentAnswer?.selectedOption !== null && currentAnswer?.selectedOption !== undefined;

  const handleSelectOption = (optionIndex: number) => {
    // In practice mode, lock once selected to preserve instant feedback integrity
    if (mode === 'practice' && hasAnswered) return;

    setUserAnswers(prev => ({
      ...prev,
      [currentQ.id]: {
        questionId: currentQ.id,
        selectedOption: optionIndex,
        isCorrect: optionIndex === currentQ.correctAnswer,
        bookmarked: prev[currentQ.id]?.bookmarked || false,
      }
    }));
  };

  const handleToggleBookmark = () => {
    setUserAnswers(prev => ({
      ...prev,
      [currentQ.id]: {
        questionId: currentQ.id,
        selectedOption: prev[currentQ.id]?.selectedOption ?? null,
        isCorrect: prev[currentQ.id]?.isCorrect,
        bookmarked: !prev[currentQ.id]?.bookmarked
      }
    }));
  };

  // Stats calculation
  const totalQuestions = questions.length;
  const answeredCount = Object.values(userAnswers).filter(
    a => a.selectedOption !== null && a.selectedOption !== undefined
  ).length;
  const correctCount = Object.values(userAnswers).filter(a => a.isCorrect).length;
  const wrongCount = Object.values(userAnswers).filter(
    a => a.selectedOption !== null && a.isCorrect === false
  ).length;

  const progressPercentage = Math.round((answeredCount / totalQuestions) * 100);

  // Time formatter
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'n') {
        if (currentIndex < questions.length - 1) setCurrentIndex(prev => prev + 1);
      } else if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'p') {
        if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
      } else if (['a', 'b', 'c', 'd', 'e'].includes(e.key.toLowerCase())) {
        const keyMap: Record<string, number> = { a: 0, b: 1, c: 2, d: 3, e: 4 };
        const optIdx = keyMap[e.key.toLowerCase()];
        if (optIdx < currentQ.options.length) {
          handleSelectOption(optIdx);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, currentQ, hasAnswered, mode]);

  const optionLetters = ['A', 'B', 'C', 'D', 'E'];

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20 animate-fadeIn">
      {/* Top Header Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm transition-colors">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to exit this quiz session?')) {
                  onExit();
                }
              }}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Exit Session"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {mode === 'practice' ? 'Practice Session' : 'Exam Simulation'}
              </span>
              <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                Question <span className="font-mono">{currentIndex + 1}</span> of{' '}
                <span className="font-mono">{totalQuestions}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Timer */}
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs font-bold ${
                mode === 'exam' && timeRemainingSeconds < 300
                  ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 animate-pulse'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{formatTime(mode === 'exam' ? timeRemainingSeconds : elapsedSeconds)}</span>
            </div>

            {/* Question Palette Trigger */}
            <button
              onClick={() => setPaletteOpen(true)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors"
              title="Open Question Palette"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>

            {/* Flag / Bookmark */}
            <button
              onClick={handleToggleBookmark}
              className={`p-2 rounded-lg border transition-colors ${
                currentAnswer?.bookmarked
                  ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-400 text-amber-600 dark:text-amber-400'
                  : 'border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
              title={currentAnswer?.bookmarked ? 'Question Flagged' : 'Flag Question'}
            >
              <Bookmark className={`w-4 h-4 ${currentAnswer?.bookmarked ? 'fill-amber-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full transition-all duration-300 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono">
            <span>{progressPercentage}% Completed</span>
            {mode === 'practice' && (
              <div className="flex items-center gap-2">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  {correctCount} Correct
                </span>
                <span>·</span>
                <span className="text-rose-500 font-bold">{wrongCount} Wrong</span>
              </div>
            )}
            {mode === 'exam' && (
              <span>{answeredCount} of {totalQuestions} answered</span>
            )}
          </div>
        </div>
      </div>

      {/* Main Question Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm transition-colors">
        {/* Topic & Source Meta */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-4">
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">
            {currentQ.topicName}
          </span>
          {currentQ.source && (
            <>
              <span aria-hidden="true">·</span>
              <span className="text-slate-400 dark:text-slate-500">{currentQ.source}</span>
            </>
          )}
        </div>

        {/* Question Text */}
        <h2 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white leading-relaxed mb-6 select-text">
          {currentQ.question}
        </h2>

        {/* Options Grid */}
        <div className="space-y-3">
          {currentQ.options.map((option, idx) => {
            const isSelected = currentAnswer?.selectedOption === idx;
            const isCorrectOption = idx === currentQ.correctAnswer;

            let optionStyle =
              'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700 text-slate-800 dark:text-slate-200';
            let badgeStyle =
              'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700';

            if (mode === 'practice' && hasAnswered) {
              if (isCorrectOption) {
                optionStyle =
                  'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/30 text-emerald-950 dark:text-emerald-200 shadow-xs';
                badgeStyle = 'bg-emerald-500 text-white border-emerald-600 font-bold';
              } else if (isSelected && !currentAnswer.isCorrect) {
                optionStyle =
                  'border-rose-400 bg-rose-50/80 dark:bg-rose-950/30 text-rose-950 dark:text-rose-200 shadow-xs';
                badgeStyle = 'bg-rose-500 text-white border-rose-600 font-bold';
              }
            } else if (isSelected) {
              optionStyle =
                'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20 text-slate-900 dark:text-white ring-1 ring-emerald-500';
              badgeStyle = 'bg-emerald-600 text-white border-emerald-600 font-bold';
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(idx)}
                className={`w-full text-left p-3.5 sm:p-4 rounded-xl border flex items-start gap-3.5 transition-all text-sm sm:text-base ${optionStyle} ${
                  mode === 'practice' && hasAnswered ? 'cursor-default' : 'cursor-pointer active:scale-99'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 font-mono text-xs font-bold transition-colors ${badgeStyle}`}
                >
                  {mode === 'practice' && hasAnswered ? (
                    isCorrectOption ? (
                      <CheckCircle className="w-4 h-4 stroke-[2.5]" />
                    ) : isSelected ? (
                      <XCircle className="w-4 h-4 stroke-[2.5]" />
                    ) : (
                      optionLetters[idx]
                    )
                  ) : (
                    optionLetters[idx]
                  )}
                </div>
                <div className="flex-1 pt-0.5 leading-snug">{option}</div>
              </button>
            );
          })}
        </div>

        {/* Instant Pedagogical Explanation Box (Practice Mode or study) */}
        {mode === 'practice' && hasAnswered && (
          <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800/80 animate-fadeIn">
            <div
              className={`p-4 sm:p-5 rounded-xl border ${
                currentAnswer.isCorrect
                  ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40'
                  : 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/40'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                {currentAnswer.isCorrect ? (
                  <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <HelpCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                )}
                <span
                  className={`text-xs font-bold uppercase tracking-wider ${
                    currentAnswer.isCorrect
                      ? 'text-emerald-700 dark:text-emerald-400'
                      : 'text-amber-700 dark:text-amber-400'
                  }`}
                >
                  {currentAnswer.isCorrect
                    ? 'Correct! Explanation:'
                    : `Incorrect. Correct Answer: Option ${optionLetters[currentQ.correctAnswer]}`}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {currentQ.explanation}
              </p>

              {currentQ.source && (
                <div className="mt-3 pt-2 border-t border-slate-200/50 dark:border-slate-800/50 text-[11px] text-slate-400 dark:text-slate-500">
                  Reference: {currentQ.source}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Sticky Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 py-3 px-4 shadow-lg">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-3">
          <button
            onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            className="inline-flex items-center gap-1 px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Previous</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPaletteOpen(true)}
              className="px-3 py-2 text-xs font-semibold rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
            >
              <span className="font-mono">
                {currentIndex + 1} / {totalQuestions}
              </span>
            </button>

            <button
              onClick={() => {
                if (
                  mode === 'exam' &&
                  answeredCount < totalQuestions &&
                  !window.confirm(
                    `You have answered ${answeredCount} of ${totalQuestions} questions. Are you sure you want to finish now?`
                  )
                ) {
                  return;
                }
                onFinish(userAnswers, elapsedSeconds);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold rounded-lg shadow-sm transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Finish & Submit</span>
            </button>
          </div>

          <button
            onClick={() => setCurrentIndex(prev => Math.min(totalQuestions - 1, prev + 1))}
            disabled={currentIndex === totalQuestions - 1}
            className="inline-flex items-center gap-1 px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Palette Navigation Modal */}
      <QuestionPalette
        questions={questions}
        currentIndex={currentIndex}
        userAnswers={userAnswers}
        mode={mode}
        onSelectQuestion={idx => setCurrentIndex(idx)}
        onClose={() => setPaletteOpen(false)}
        isOpen={paletteOpen}
      />
    </div>
  );
};
