import React, { useState, useMemo } from 'react';
import { Question, Topic } from '../types';
import { TOPICS, GES107_QUESTIONS } from '../data/ges107Questions';
import { Search, Filter, Eye, EyeOff, BookOpen, CheckCircle, Sparkles } from 'lucide-react';

interface StudyBrowserProps {
  onStartQuizWithTopic: (topicId: string) => void;
}

export const StudyBrowser: React.FC<StudyBrowserProps> = ({ onStartQuizWithTopic }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [revealedAnswers, setRevealedAnswers] = useState<Record<number, boolean>>({});
  const [revealAll, setRevealAll] = useState(false);

  const toggleReveal = (id: number) => {
    setRevealedAnswers(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleToggleRevealAll = () => {
    const newState = !revealAll;
    setRevealAll(newState);
    const updated: Record<number, boolean> = {};
    GES107_QUESTIONS.forEach(q => {
      updated[q.id] = newState;
    });
    setRevealedAnswers(updated);
  };

  const filteredQuestions = useMemo(() => {
    return GES107_QUESTIONS.filter(q => {
      const matchesTopic = selectedTopic === 'all' || q.topicId === selectedTopic;
      const qLower = q.question.toLowerCase();
      const expLower = q.explanation.toLowerCase();
      const optionsLower = q.options.join(' ').toLowerCase();
      const searchLower = searchQuery.toLowerCase().trim();

      const matchesSearch =
        !searchLower ||
        qLower.includes(searchLower) ||
        expLower.includes(searchLower) ||
        optionsLower.includes(searchLower);

      return matchesTopic && matchesSearch;
    });
  }, [searchQuery, selectedTopic]);

  const optionLetters = ['A', 'B', 'C', 'D', 'E'];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 animate-fadeIn">
      {/* Header card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
              <BookOpen className="w-4 h-4" />
              <span>GES 107 REVISION REPOSITORY</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Question Bank & Revision Notes
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Search and study all {GES107_QUESTIONS.length} verified past exam & test questions with accompanying explanations.
            </p>
          </div>

          <button
            onClick={handleToggleRevealAll}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shrink-0"
          >
            {revealAll ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span>{revealAll ? 'Hide All Answers' : 'Reveal All Answers'}</span>
          </button>
        </div>

        {/* Search & Topic Filter Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search keyword (e.g. CD4, HAART, Kwashiorkor, Bircher, condom)..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-slate-400"
            />
          </div>

          <div>
            <select
              value={selectedTopic}
              onChange={e => setSelectedTopic(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            >
              <option value="all">All Topics ({GES107_QUESTIONS.length})</option>
              {TOPICS.filter(t => t.id !== 'all').map(t => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.questionCount})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search result count */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing <strong className="text-slate-900 dark:text-white">{filteredQuestions.length}</strong> matching questions
          </span>
          {selectedTopic !== 'all' && (
            <button
              onClick={() => onStartQuizWithTopic(selectedTopic)}
              className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
            >
              Quiz this topic &rarr;
            </button>
          )}
        </div>
      </div>

      {/* Questions list */}
      <div className="space-y-4">
        {filteredQuestions.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No questions found matching "{searchQuery}". Try different keywords.
            </p>
          </div>
        ) : (
          filteredQuestions.map((q, idx) => {
            const isRevealed = revealAll || (revealedAnswers[q.id] ?? false);

            return (
              <div
                key={q.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs transition-colors"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-mono font-bold text-slate-400">#{idx + 1}</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      {q.topicName}
                    </span>
                    {q.source && (
                      <span className="text-slate-400 hidden sm:inline">· {q.source}</span>
                    )}
                  </div>

                  <button
                    onClick={() => toggleReveal(q.id)}
                    className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-md text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 transition-colors"
                  >
                    {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{isRevealed ? 'Hide Answer' : 'Show Answer'}</span>
                  </button>
                </div>

                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-relaxed mb-4">
                  {q.question}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                  {q.options.map((opt, optIdx) => {
                    const isCorrect = isRevealed && optIdx === q.correctAnswer;

                    return (
                      <div
                        key={optIdx}
                        className={`text-xs sm:text-sm p-2.5 rounded-xl border flex items-start gap-2.5 transition-colors ${
                          isCorrect
                            ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-400 text-emerald-900 dark:text-emerald-200 font-semibold shadow-xs'
                            : 'bg-slate-50/50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <span
                          className={`w-5 h-5 rounded-md flex items-center justify-center font-mono text-[11px] font-bold shrink-0 ${
                            isCorrect
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          {optionLetters[optIdx]}
                        </span>
                        <span className="flex-1 leading-snug">{opt}</span>
                      </div>
                    );
                  })}
                </div>

                {isRevealed && (
                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 animate-fadeIn">
                    <div className="bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 p-3.5 rounded-xl text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      <div className="font-bold text-emerald-700 dark:text-emerald-400 mb-1">
                        Correct Answer: Option {optionLetters[q.correctAnswer]} ({q.options[q.correctAnswer]})
                      </div>
                      <div>{q.explanation}</div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
