import React from 'react';
import { UserAnswer, Question, QuizMode } from '../types';
import { X, Bookmark, CheckCircle2, AlertCircle } from 'lucide-react';

interface QuestionPaletteProps {
  questions: Question[];
  currentIndex: number;
  userAnswers: Record<number, UserAnswer>;
  mode: QuizMode;
  onSelectQuestion: (index: number) => void;
  onClose: () => void;
  isOpen: boolean;
}

export const QuestionPalette: React.FC<QuestionPaletteProps> = ({
  questions,
  currentIndex,
  userAnswers,
  mode,
  onSelectQuestion,
  onClose,
  isOpen
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-xl max-h-[85vh] flex flex-col shadow-xl">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Question Navigator
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Jump directly to any question or review flagged items
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Legend */}
        <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex flex-wrap gap-4 text-xs text-slate-600 dark:text-slate-400">
          {mode === 'practice' ? (
            <>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-emerald-500"></span>
                <span>Correct</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-rose-500"></span>
                <span>Wrong</span>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-emerald-600"></span>
              <span>Answered</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-amber-500"></span>
            <span>Flagged</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-slate-200 dark:bg-slate-700"></span>
            <span>Unvisited</span>
          </div>
        </div>

        {/* Questions Grid */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1">
          <div className="grid grid-cols-5 sm:grid-cols-8 gap-2">
            {questions.map((q, idx) => {
              const ans = userAnswers[q.id];
              const isCurrent = idx === currentIndex;
              const hasAnswer = ans?.selectedOption !== null && ans?.selectedOption !== undefined;
              const isFlagged = ans?.bookmarked;

              let bgClass = 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';

              if (mode === 'practice' && hasAnswer) {
                if (ans.isCorrect) {
                  bgClass = 'bg-emerald-500 text-white border-emerald-600';
                } else {
                  bgClass = 'bg-rose-500 text-white border-rose-600';
                }
              } else if (mode === 'exam' && hasAnswer) {
                bgClass = 'bg-emerald-600 text-white border-emerald-700';
              }

              if (isFlagged) {
                bgClass += ' ring-2 ring-amber-400 ring-offset-1 dark:ring-offset-slate-900';
              }

              return (
                <button
                  key={q.id}
                  onClick={() => {
                    onSelectQuestion(idx);
                    onClose();
                  }}
                  className={`h-10 rounded-lg text-xs font-mono font-bold flex items-center justify-center border transition-all ${bgClass} ${
                    isCurrent ? 'ring-2 ring-emerald-500 scale-105 shadow-md font-extrabold' : ''
                  }`}
                >
                  <span>{idx + 1}</span>
                  {isFlagged && (
                    <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-semibold"
          >
            Close Navigator
          </button>
        </div>
      </div>
    </div>
  );
};
