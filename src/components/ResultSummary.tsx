import React, { useState } from 'react';
import { Question, UserAnswer } from '../types';
import {
  Trophy,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  Filter,
  Bookmark,
  Share2,
  FileCheck,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface ResultSummaryProps {
  questions: Question[];
  userAnswers: Record<number, UserAnswer>;
  timeTakenSeconds: number;
  onRetakeAll: () => void;
  onRetakeMissed: (missedQuestions: Question[]) => void;
  onBackToTopics: () => void;
}

export const ResultSummary: React.FC<ResultSummaryProps> = ({
  questions,
  userAnswers,
  timeTakenSeconds,
  onRetakeAll,
  onRetakeMissed,
  onBackToTopics
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'missed' | 'correct' | 'bookmarked'>('all');
  const [expandedQuestions, setExpandedQuestions] = useState<Record<number, boolean>>({});

  const total = questions.length;
  let correct = 0;
  let wrong = 0;
  let unattempted = 0;

  const missedQuestionsList: Question[] = [];

  questions.forEach(q => {
    const ans = userAnswers[q.id];
    if (!ans || ans.selectedOption === null || ans.selectedOption === undefined) {
      unattempted++;
      missedQuestionsList.push(q);
    } else if (ans.isCorrect) {
      correct++;
    } else {
      wrong++;
      missedQuestionsList.push(q);
    }
  });

  const percentage = Math.round((correct / total) * 100);

  // University of Ibadan Grade System
  let grade = 'F';
  let gradeLabel = 'Needs Improvement';
  let gradeColor = 'text-rose-600 dark:text-rose-400';
  let gradeBadgeBg = 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900';

  if (percentage >= 70) {
    grade = 'A';
    gradeLabel = 'Excellent Performance (Distinction)';
    gradeColor = 'text-emerald-600 dark:text-emerald-400';
    gradeBadgeBg = 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900';
  } else if (percentage >= 60) {
    grade = 'B';
    gradeLabel = 'Very Good';
    gradeColor = 'text-blue-600 dark:text-blue-400';
    gradeBadgeBg = 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900';
  } else if (percentage >= 50) {
    grade = 'C';
    gradeLabel = 'Good (Credit)';
    gradeColor = 'text-amber-600 dark:text-amber-400';
    gradeBadgeBg = 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900';
  } else if (percentage >= 45) {
    grade = 'D';
    gradeLabel = 'Pass';
    gradeColor = 'text-orange-600 dark:text-orange-400';
    gradeBadgeBg = 'bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-900';
  }

  // Format Time
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    if (mins === 0) return `${remainder}s`;
    return `${mins}m ${remainder}s`;
  };

  const avgSeconds = total > 0 ? Math.round(timeTakenSeconds / total) : 0;

  // Topic Breakdown
  const topicMap: Record<string, { name: string; total: number; correct: number }> = {};
  questions.forEach(q => {
    if (!topicMap[q.topicId]) {
      topicMap[q.topicId] = { name: q.topicName, total: 0, correct: 0 };
    }
    topicMap[q.topicId].total++;
    if (userAnswers[q.id]?.isCorrect) {
      topicMap[q.topicId].correct++;
    }
  });

  const toggleExpand = (id: number) => {
    setExpandedQuestions(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Filtered review questions
  const filteredQuestions = questions.filter(q => {
    const ans = userAnswers[q.id];
    if (filterMode === 'missed') {
      return !ans || ans.selectedOption === null || ans.isCorrect === false;
    }
    if (filterMode === 'correct') {
      return ans?.isCorrect === true;
    }
    if (filterMode === 'bookmarked') {
      return ans?.bookmarked === true;
    }
    return true;
  });

  const optionLetters = ['A', 'B', 'C', 'D', 'E'];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 animate-fadeIn">
      {/* Primary Score Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-10 shadow-sm text-center relative overflow-hidden transition-colors">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 mb-4">
          <Trophy className="w-8 h-8" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
          Quiz Completed!
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          Here is your comprehensive score breakdown and study summary for GES 107
        </p>

        {/* Big Percentage & Grade */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 my-6">
          <div className="flex flex-col items-center">
            <span className="text-5xl sm:text-6xl font-extrabold font-mono text-slate-900 dark:text-white tracking-tight">
              {percentage}%
            </span>
            <span className="text-xs uppercase font-bold text-slate-400 mt-1">Overall Score</span>
          </div>

          <div className="hidden sm:block w-px h-16 bg-slate-200 dark:bg-slate-800"></div>

          <div className={`px-5 py-3 rounded-xl border ${gradeBadgeBg} flex flex-col items-center`}>
            <span className={`text-3xl font-black font-mono ${gradeColor}`}>
              Grade {grade}
            </span>
            <span className={`text-xs font-semibold ${gradeColor} mt-0.5`}>
              {gradeLabel}
            </span>
          </div>
        </div>

        {/* 4 Stat Boxes */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto my-6">
          <div className="bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800">
            <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
              {correct}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Correct</div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800">
            <div className="text-2xl font-bold font-mono text-rose-500">
              {wrong}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Wrong</div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800">
            <div className="text-2xl font-bold font-mono text-slate-700 dark:text-slate-300">
              {unattempted}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Skipped</div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800">
            <div className="text-2xl font-bold font-mono text-slate-700 dark:text-slate-300">
              {formatTime(timeTakenSeconds)}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Time Taken</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          {missedQuestionsList.length > 0 && (
            <button
              onClick={() => onRetakeMissed(missedQuestionsList)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm transition-colors shadow-sm"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake Missed Questions ({missedQuestionsList.length})</span>
            </button>
          )}

          <button
            onClick={onRetakeAll}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold rounded-xl text-sm border border-slate-300/60 dark:border-slate-700 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retake Full Quiz</span>
          </button>

          <button
            onClick={onBackToTopics}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold rounded-xl text-sm border border-slate-300/60 dark:border-slate-700 transition-colors"
          >
            <span>Choose Another Topic</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Topic Performance Breakdown */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm transition-colors">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
          Topic Mastery Breakdown
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
          Analyze which areas of the course you mastered and which require revision
        </p>

        <div className="space-y-4">
          {Object.entries(topicMap).map(([id, topic]) => {
            const topicPercent = Math.round((topic.correct / topic.total) * 100);
            return (
              <div key={id} className="space-y-1.5">
                <div className="flex justify-between text-xs sm:text-sm font-semibold">
                  <span className="text-slate-800 dark:text-slate-200 truncate pr-2">
                    {topic.name}
                  </span>
                  <span className="font-mono tabular-nums text-slate-600 dark:text-slate-400 shrink-0">
                    {topic.correct} / {topic.total} ({topicPercent}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      topicPercent >= 70
                        ? 'bg-emerald-500'
                        : topicPercent >= 50
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${topicPercent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Question Review Section with Explanations */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Detailed Question Review
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Inspect correct answers and read explanations for each question
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl text-xs font-semibold overflow-x-auto">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                filterMode === 'all'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              All ({total})
            </button>
            <button
              onClick={() => setFilterMode('missed')}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                filterMode === 'missed'
                  ? 'bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Missed ({wrong + unattempted})
            </button>
            <button
              onClick={() => setFilterMode('correct')}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                filterMode === 'correct'
                  ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Correct ({correct})
            </button>
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-4">
          {filteredQuestions.map((q, idx) => {
            const ans = userAnswers[q.id];
            const hasAnswer = ans?.selectedOption !== null && ans?.selectedOption !== undefined;
            const isCorrect = ans?.isCorrect;
            const isExpanded = expandedQuestions[q.id] ?? false;

            return (
              <div
                key={q.id}
                className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 transition-colors"
              >
                {/* Question Header */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-400">
                      #{idx + 1}
                    </span>
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      {q.topicName}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {hasAnswer ? (
                      isCorrect ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Correct</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-500 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded-md">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Wrong</span>
                        </span>
                      )
                    ) : (
                      <span className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md font-medium">
                        Unattempted
                      </span>
                    )}

                    <button
                      onClick={() => toggleExpand(q.id)}
                      className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Question Text */}
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-relaxed mb-3">
                  {q.question}
                </h3>

                {/* Options Review */}
                <div className="space-y-1.5 mb-3">
                  {q.options.map((opt, optIdx) => {
                    const isUserChoice = ans?.selectedOption === optIdx;
                    const isRightAnswer = optIdx === q.correctAnswer;

                    let rowStyle = 'text-slate-600 dark:text-slate-400 border-transparent';
                    if (isRightAnswer) {
                      rowStyle = 'text-emerald-700 dark:text-emerald-300 font-semibold bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800';
                    } else if (isUserChoice && !isCorrect) {
                      rowStyle = 'text-rose-700 dark:text-rose-300 font-semibold bg-rose-50/70 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800 line-through';
                    }

                    return (
                      <div
                        key={optIdx}
                        className={`text-xs sm:text-sm p-2 rounded-lg border flex items-center justify-between gap-2 ${rowStyle}`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold">{optionLetters[optIdx]}.</span>
                          <span>{opt}</span>
                        </div>
                        {isRightAnswer && (
                          <span className="text-[11px] uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-bold shrink-0">
                            ✓ Correct
                          </span>
                        )}
                        {isUserChoice && !isRightAnswer && (
                          <span className="text-[11px] uppercase tracking-wider text-rose-500 font-bold shrink-0">
                            Your Choice
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50/50 dark:bg-slate-850 p-3 rounded-lg">
                  <div className="font-bold text-slate-800 dark:text-slate-200 mb-1">
                    Explanatory Note:
                  </div>
                  <div>{q.explanation}</div>
                  {q.source && (
                    <div className="mt-1 text-[11px] text-slate-400">
                      Source: {q.source}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
