import React, { useState } from 'react';
import { TOPICS, TOTAL_QUESTIONS_COUNT } from '../data/ges107Questions';
import { QuizMode } from '../types';
import { Play, Clock, Sparkles, CheckCircle2, Shuffle, Check, FileDown, BookOpen } from 'lucide-react';

interface TopicSelectorProps {
  onStartQuiz: (config: {
    selectedTopicIds: string[];
    mode: QuizMode;
    questionCount: number;
    shuffleQuestions: boolean;
    timerMinutes: number;
  }) => void;
  onOpenBrowser: () => void;
  onDownloadHtml: () => void;
}

export const TopicSelector: React.FC<TopicSelectorProps> = ({
  onStartQuiz,
  onOpenBrowser,
  onDownloadHtml
}) => {
  const [selectedTopics, setSelectedTopics] = useState<string[]>(['all']);
  const [mode, setMode] = useState<QuizMode>('practice');
  const [questionCount, setQuestionCount] = useState<number>(30);
  const [shuffleQuestions, setShuffleQuestions] = useState<boolean>(true);
  const [timerMinutes, setTimerMinutes] = useState<number>(30);

  const isAllSelected = selectedTopics.includes('all');

  const handleToggleTopic = (topicId: string) => {
    if (topicId === 'all') {
      setSelectedTopics(['all']);
      return;
    }

    let updated = selectedTopics.filter(id => id !== 'all');
    if (updated.includes(topicId)) {
      updated = updated.filter(id => id !== topicId);
      if (updated.length === 0) {
        updated = ['all'];
      }
    } else {
      updated.push(topicId);
    }
    setSelectedTopics(updated);
  };

  const handleStart = () => {
    onStartQuiz({
      selectedTopicIds: selectedTopics,
      mode,
      questionCount,
      shuffleQuestions,
      timerMinutes
    });
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-sm transition-colors">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-3 tracking-wide">
            <span>UNIVERSITY OF IBADAN</span>
            <span aria-hidden="true">·</span>
            <span>GENERAL STUDIES PROGRAMME</span>
            <span aria-hidden="true">·</span>
            <span>UPDATED QUESTION BANK</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
            GES 107 CBT & Revision Practice
          </h1>

          <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
            Master Reproductive Health, Sexually Transmitted Infections, HIV/AIDS, Nutrition, and Health Education with instant feedback, official past examination questions (2014–2025), and comprehensive educational explanations.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleStart}
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm sm:text-base shadow-sm transition-all transform active:scale-98"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Start {mode === 'practice' ? 'Instant Practice' : 'Exam Simulation'}</span>
            </button>

            <button
              onClick={onOpenBrowser}
              className="inline-flex items-center gap-2 px-5 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold rounded-xl text-sm sm:text-base border border-slate-300/60 dark:border-slate-700 transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              <span>Browse All Questions</span>
            </button>

            <button
              onClick={onDownloadHtml}
              className="inline-flex sm:hidden items-center gap-2 px-4 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-xl text-sm border border-slate-300/60 dark:border-slate-700 transition-colors"
            >
              <FileDown className="w-4 h-4" />
              <span>Export HTML</span>
            </button>
          </div>
        </div>

        {/* Quiet metadata footer inside hero */}
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-500 dark:text-slate-400">
          <span>{TOTAL_QUESTIONS_COUNT} Total Questions</span>
          <span aria-hidden="true">·</span>
          <span>10 Detailed Modules</span>
          <span aria-hidden="true">·</span>
          <span>140 Question Past Exam Included</span>
          <span aria-hidden="true">·</span>
          <span>Recent 2022–2025 CA Tests</span>
        </div>
      </div>

      {/* Main Settings & Topic Selection Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Practice Configuration (1 col) */}
        <div className="space-y-6">
          {/* Mode Selector */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
              Practice Mode
            </h2>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl">
              <button
                type="button"
                onClick={() => setMode('practice')}
                className={`py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                  mode === 'practice'
                    ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Instant Feedback
              </button>
              <button
                type="button"
                onClick={() => setMode('exam')}
                className={`py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                  mode === 'exam'
                    ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Timed Exam
              </button>
            </div>
            <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {mode === 'practice'
                ? 'Answers are graded instantly upon clicking. Detailed educational explanations show immediately so you learn on the go.'
                : 'Simulates strict CBT exam conditions. Timer counts down, answers remain unrevealed until final submission.'}
            </p>
          </div>

          {/* Number of Questions */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
              Question Count
            </h2>
            <div className="grid grid-cols-4 gap-2">
              {[15, 30, 50, TOTAL_QUESTIONS_COUNT].map(count => (
                <button
                  key={count}
                  type="button"
                  onClick={() => setQuestionCount(count)}
                  className={`py-2 text-xs font-semibold rounded-lg border transition-all ${
                    questionCount === count
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                      : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {count === TOTAL_QUESTIONS_COUNT ? 'All' : count}
                </button>
              ))}
            </div>
          </div>

          {/* Exam Timer (if exam mode) */}
          {mode === 'exam' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm animate-fadeIn">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span>Timer Duration</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[15, 30, 60].map(mins => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setTimerMinutes(mins)}
                    className={`py-2 text-xs font-semibold rounded-lg border transition-all ${
                      timerMinutes === mins
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                        : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {mins} mins
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Randomization */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
            <label className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-2">
                <Shuffle className="w-4 h-4 text-slate-500" />
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Shuffle Questions
                </span>
              </div>
              <input
                type="checkbox"
                checked={shuffleQuestions}
                onChange={e => setShuffleQuestions(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded border-slate-300 dark:border-slate-700 focus:ring-emerald-500"
              />
            </label>
          </div>
        </div>

        {/* Right Column: Topics Selection (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Course Topics & Chapters
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Choose all chapters or select specific topics for customized study
              </p>
            </div>

            <button
              onClick={() => setSelectedTopics(['all'])}
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              Select All
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {TOPICS.map(topic => {
              const selected = isAllSelected ? topic.id === 'all' : selectedTopics.includes(topic.id);

              return (
                <div
                  key={topic.id}
                  onClick={() => handleToggleTopic(topic.id)}
                  className={`relative p-4 rounded-xl border text-left cursor-pointer transition-all duration-150 ${
                    selected
                      ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-500 shadow-sm'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                          {topic.badge}
                        </span>
                        <span className="text-xs text-slate-400">·</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                          {topic.questionCount} Qs
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                        {topic.name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {topic.description}
                      </p>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center border shrink-0 transition-colors ${
                        selected
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800'
                      }`}
                    >
                      {selected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Launch Bottom Bar */}
          <div className="pt-4 flex items-center justify-between bg-slate-50 dark:bg-slate-850 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="text-xs text-slate-600 dark:text-slate-400">
              <span className="font-semibold text-slate-900 dark:text-white">
                {isAllSelected ? 'All Topics' : `${selectedTopics.length} Topics Selected`}
              </span>
              <span className="mx-2">·</span>
              <span>{questionCount} Questions</span>
              <span className="mx-2">·</span>
              <span className="capitalize">{mode} Mode</span>
            </div>

            <button
              onClick={handleStart}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-sm transition-colors"
            >
              <span>Begin Session</span>
              <Play className="w-3.5 h-3.5 fill-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
