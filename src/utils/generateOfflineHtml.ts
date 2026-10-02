import { Question } from '../types';

export function buildStandaloneHtml(questions: Question[]): string {
  const jsonQuestions = JSON.stringify(questions).replace(/<\/script>/gi, '<\\/script>');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GES 107 Interactive CBT Quiz & Study Prep</title>
  <meta name="description" content="GES 107 Interactive Quiz - Reproductive Health, STIs, HIV/AIDS & Nutrition">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #f8fafc;
      --card-bg: #ffffff;
      --text: #0f172a;
      --text-muted: #64748b;
      --border: #e2e8f0;
      --primary: #0284c7;
      --primary-hover: #0369a1;
      --success: #10b981;
      --success-bg: #ecfdf5;
      --success-border: #a7f3d0;
      --error: #ef4444;
      --error-bg: #fef2f2;
      --error-border: #fecaca;
      --warning: #f59e0b;
    }
    .dark {
      --bg: #090d16;
      --card-bg: #111827;
      --text: #f1f5f9;
      --text-muted: #94a3b8;
      --border: #1f2937;
      --primary: #38bdf8;
      --primary-hover: #0ea5e9;
      --success: #34d399;
      --success-bg: #064e3b33;
      --success-border: #065f46;
      --error: #f87171;
      --error-bg: #7f1d1d33;
      --error-border: #991b1b;
      --warning: #fbbf24;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      background-color: var(--bg);
      color: var(--text);
      line-height: 1.6;
      transition: background-color 0.2s, color 0.2s;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    header {
      background: var(--card-bg);
      border-bottom: 1px solid var(--border);
      position: sticky;
      top: 0;
      z-index: 40;
      padding: 0.85rem 1.5rem;
    }
    .header-inner {
      max-width: 900px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .brand {
      font-size: 1.15rem;
      font-weight: 700;
      letter-spacing: -0.02em;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      text-decoration: none;
      color: var(--text);
    }
    .badge {
      font-size: 0.75rem;
      font-weight: 600;
      background: #0284c715;
      color: var(--primary);
      padding: 0.2rem 0.6rem;
      border-radius: 9999px;
    }
    .btn {
      font-family: inherit;
      font-size: 0.875rem;
      font-weight: 600;
      border-radius: 0.5rem;
      padding: 0.5rem 1rem;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      border: 1px solid var(--border);
      background: var(--card-bg);
      color: var(--text);
      transition: all 0.15s ease;
    }
    .btn:hover { background: var(--border); }
    .btn-primary { background: var(--primary); color: #fff; border-color: var(--primary); }
    .btn-primary:hover { background: var(--primary-hover); }
    .container {
      max-width: 900px;
      margin: 2rem auto;
      padding: 0 1rem;
      flex: 1;
      width: 100%;
    }
    .card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 1rem;
      padding: 1.5rem;
      margin-bottom: 1.5rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    .progress-bar-container {
      background: var(--border);
      height: 6px;
      border-radius: 999px;
      overflow: hidden;
      margin: 1rem 0;
    }
    .progress-bar {
      height: 100%;
      background: var(--primary);
      transition: width 0.3s ease;
    }
    .meta-line {
      font-size: 0.8rem;
      color: var(--text-muted);
      margin-bottom: 0.75rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex-wrap: wrap;
    }
    .question-title {
      font-size: 1.15rem;
      font-weight: 600;
      margin-bottom: 1.25rem;
      line-height: 1.5;
    }
    .options-grid {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .option-btn {
      width: 100%;
      text-align: left;
      padding: 1rem 1.25rem;
      border-radius: 0.75rem;
      border: 1px solid var(--border);
      background: var(--card-bg);
      color: var(--text);
      font-size: 0.95rem;
      cursor: pointer;
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      transition: border-color 0.15s, background-color 0.15s;
    }
    .option-btn:hover:not(:disabled) {
      border-color: var(--primary);
      background: #0284c70a;
    }
    .opt-letter {
      font-family: 'JetBrains Mono', monospace;
      font-weight: 700;
      font-size: 0.85rem;
      width: 26px;
      height: 26px;
      border-radius: 6px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: var(--border);
      flex-shrink: 0;
      color: var(--text);
    }
    .option-btn.correct {
      background: var(--success-bg) !important;
      border-color: var(--success) !important;
      color: var(--text);
    }
    .option-btn.correct .opt-letter {
      background: var(--success);
      color: #fff;
    }
    .option-btn.wrong {
      background: var(--error-bg) !important;
      border-color: var(--error) !important;
      color: var(--text);
    }
    .option-btn.wrong .opt-letter {
      background: var(--error);
      color: #fff;
    }
    .explanation-box {
      margin-top: 1.25rem;
      padding: 1rem 1.25rem;
      border-radius: 0.75rem;
      background: #0284c70d;
      border-left: 4px solid var(--primary);
      font-size: 0.9rem;
    }
    .explanation-title {
      font-weight: 700;
      margin-bottom: 0.35rem;
      color: var(--primary);
    }
    .footer-nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 1.5rem;
      gap: 1rem;
    }
    .stats-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 1rem;
      margin: 1.5rem 0;
    }
    .stat-box {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 0.75rem;
      padding: 1rem;
      text-align: center;
    }
    .stat-num {
      font-size: 1.75rem;
      font-weight: 700;
      font-family: 'JetBrains Mono', monospace;
    }
    .stat-label {
      font-size: 0.8rem;
      color: var(--text-muted);
    }
    .palette-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(36px, 1fr));
      gap: 0.4rem;
      max-height: 240px;
      overflow-y: auto;
      padding: 0.5rem;
      background: var(--bg);
      border-radius: 0.5rem;
      margin-top: 1rem;
    }
    .palette-item {
      height: 36px;
      border-radius: 6px;
      border: 1px solid var(--border);
      background: var(--card-bg);
      color: var(--text);
      font-size: 0.8rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
    .palette-item.current { outline: 2px solid var(--primary); }
    .palette-item.answered-correct { background: var(--success); color: #fff; border-color: var(--success); }
    .palette-item.answered-wrong { background: var(--error); color: #fff; border-color: var(--error); }
    @media (max-width: 640px) {
      .card { padding: 1rem; }
      .brand { font-size: 1rem; }
    }
  </style>
</head>
<body>
  <header>
    <div class="header-inner">
      <a href="#" onclick="showHome(); return false;" class="brand">
        <span>GES 107</span>
        <span class="badge">CBT Prep</span>
      </a>
      <div style="display: flex; gap: 0.5rem; align-items: center;">
        <button class="btn" id="themeBtn" onclick="toggleTheme()" title="Toggle Dark/Light Mode">🌙 Theme</button>
      </div>
    </div>
  </header>

  <main class="container" id="app">
    <!-- View will render dynamically -->
  </main>

  <script>
    const ALL_QUESTIONS = ${jsonQuestions};
    let currentQuestions = [...ALL_QUESTIONS];
    let currentIndex = 0;
    let userAnswers = {}; // { questionId: { selectedOption, isCorrect } }
    let selectedTopic = 'all';

    function init() {
      if (localStorage.getItem('ges107_theme') === 'dark' || 
          (!localStorage.getItem('ges107_theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
        document.getElementById('themeBtn').textContent = '☀️ Light';
      }
      renderHome();
    }

    function toggleTheme() {
      const isDark = document.documentElement.classList.toggle('dark');
      localStorage.setItem('ges107_theme', isDark ? 'dark' : 'light');
      document.getElementById('themeBtn').textContent = isDark ? '☀️ Light' : '🌙 Theme';
    }

    function renderHome() {
      // Group topics
      const topicsMap = {};
      ALL_QUESTIONS.forEach(q => {
        if (!topicsMap[q.topicId]) {
          topicsMap[q.topicId] = { id: q.topicId, name: q.topicName, count: 0 };
        }
        topicsMap[q.topicId].count++;
      });

      const topicsHtml = Object.values(topicsMap).map(t => \`
        <div class="card" style="margin-bottom: 0.75rem; display: flex; justify-content: space-between; align-items: center; cursor: pointer;" onclick="startQuiz('\${t.id}')">
          <div>
            <div style="font-weight: 600; font-size: 1rem;">\${t.name}</div>
            <div style="font-size: 0.8rem; color: var(--text-muted);">\${t.count} Verified Questions</div>
          </div>
          <button class="btn btn-primary">Practice Topic &rarr;</button>
        </div>
      \`).join('');

      document.getElementById('app').innerHTML = \`
        <div class="card" style="text-align: center; padding: 2.5rem 1.5rem;">
          <h1 style="font-size: 1.75rem; font-weight: 800; margin-bottom: 0.5rem; letter-spacing: -0.02em;">GES 107 Interactive Quiz Prep</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; max-width: 600px; margin: 0 auto 1.5rem;">
            Reproductive Health, STIs, HIV/AIDS & Nutrition. Complete CBT question bank with instant answer feedback, explanatory notes, and exam practice.
          </p>
          <div style="display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap;">
            <button class="btn btn-primary" onclick="startQuiz('all')">
              🚀 Start Full Quiz (\${ALL_QUESTIONS.length} Questions)
            </button>
            <button class="btn" onclick="startQuiz('all', true)">
              🎲 Quick Random 30 Practice
            </button>
          </div>
        </div>

        <h2 style="font-size: 1.1rem; font-weight: 700; margin: 1.5rem 0 0.75rem;">Select Topic to Practice</h2>
        \${topicsHtml}
      \`;
    }

    function startQuiz(topicId, random30 = false) {
      selectedTopic = topicId;
      if (topicId === 'all') {
        currentQuestions = [...ALL_QUESTIONS];
      } else {
        currentQuestions = ALL_QUESTIONS.filter(q => q.topicId === topicId);
      }
      if (random30) {
        currentQuestions = [...currentQuestions].sort(() => 0.5 - Math.random()).slice(0, 30);
      }
      currentIndex = 0;
      userAnswers = {};
      renderQuestion();
    }

    function renderQuestion() {
      const q = currentQuestions[currentIndex];
      const ans = userAnswers[q.id];
      const hasAnswered = ans !== undefined;
      const letters = ['A', 'B', 'C', 'D', 'E'];

      const optionsHtml = q.options.map((opt, i) => {
        let extraClass = '';
        if (hasAnswered) {
          if (i === q.correctAnswer) extraClass = 'correct';
          else if (ans.selectedOption === i) extraClass = 'wrong';
        }
        return \`
          <button class="option-btn \${extraClass}" onclick="selectOption(\${i})" \${hasAnswered ? 'disabled' : ''}>
            <span class="opt-letter">\${letters[i]}</span>
            <span>\${opt}</span>
          </button>
        \`;
      }).join('');

      let explanationHtml = '';
      if (hasAnswered) {
        explanationHtml = \`
          <div class="explanation-box">
            <div class="explanation-title">\${ans.isCorrect ? '✅ Correct Answer!' : '❌ Incorrect. Correct answer is Option ' + letters[q.correctAnswer]}</div>
            <div>\${q.explanation}</div>
            \${q.source ? '<div style="font-size: 0.75rem; margin-top: 0.35rem; color: var(--text-muted);">' + q.source + '</div>' : ''}
          </div>
        \`;
      }

      const answeredCount = Object.keys(userAnswers).length;
      const progressPercent = Math.round((answeredCount / currentQuestions.length) * 100);

      // Question palette
      const paletteHtml = currentQuestions.map((qItem, idx) => {
        let cls = 'palette-item';
        if (idx === currentIndex) cls += ' current';
        if (userAnswers[qItem.id]) {
          cls += userAnswers[qItem.id].isCorrect ? ' answered-correct' : ' answered-wrong';
        }
        return \`<div class="\${cls}" onclick="jumpTo(\${idx})">\${idx + 1}</div>\`;
      }).join('');

      document.getElementById('app').innerHTML = \`
        <div class="card">
          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.85rem; color: var(--text-muted);">
            <div>Question <strong>\${currentIndex + 1}</strong> of \${currentQuestions.length}</div>
            <div>Progress: <strong>\${progressPercent}%</strong> (\${answeredCount}/\${currentQuestions.length})</div>
          </div>
          <div class="progress-bar-container">
            <div class="progress-bar" style="width: \${progressPercent}%"></div>
          </div>

          <div class="meta-line">
            <span class="badge">\${q.topicName}</span>
            \${q.source ? '<span>· ' + q.source + '</span>' : ''}
          </div>

          <h2 class="question-title">\${q.question}</h2>

          <div class="options-grid">
            \${optionsHtml}
          </div>

          \${explanationHtml}

          <div class="footer-nav">
            <button class="btn" onclick="prevQuestion()" \${currentIndex === 0 ? 'disabled' : ''}>&larr; Previous</button>
            <button class="btn btn-primary" onclick="showResults()">Finish & Score</button>
            <button class="btn" onclick="nextQuestion()" \${currentIndex === currentQuestions.length - 1 ? 'disabled' : ''}>Next &rarr;</button>
          </div>

          <details style="margin-top: 1.5rem; font-size: 0.85rem; color: var(--text-muted);">
            <summary style="cursor: pointer; font-weight: 600;">Question Navigator (\${currentQuestions.length} Questions)</summary>
            <div class="palette-grid">\${paletteHtml}</div>
          </details>
        </div>
      \`;
    }

    function selectOption(optIndex) {
      const q = currentQuestions[currentIndex];
      if (userAnswers[q.id] !== undefined) return;
      userAnswers[q.id] = {
        selectedOption: optIndex,
        isCorrect: optIndex === q.correctAnswer
      };
      renderQuestion();
    }

    function prevQuestion() {
      if (currentIndex > 0) {
        currentIndex--;
        renderQuestion();
      }
    }

    function nextQuestion() {
      if (currentIndex < currentQuestions.length - 1) {
        currentIndex++;
        renderQuestion();
      }
    }

    function jumpTo(idx) {
      currentIndex = idx;
      renderQuestion();
    }

    function showResults() {
      const total = currentQuestions.length;
      let correct = 0;
      let wrong = 0;
      Object.values(userAnswers).forEach(a => {
        if (a.isCorrect) correct++;
        else wrong++;
      });
      const unattempted = total - (correct + wrong);
      const percentage = Math.round((correct / total) * 100);

      let grade = 'F';
      if (percentage >= 70) grade = 'A (Distinction)';
      else if (percentage >= 60) grade = 'B (Credit)';
      else if (percentage >= 50) grade = 'C (Pass)';
      else if (percentage >= 45) grade = 'D (Weak Pass)';

      document.getElementById('app').innerHTML = \`
        <div class="card" style="text-align: center; padding: 2rem 1.5rem;">
          <h1 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 0.5rem;">Quiz Result Summary</h1>
          <div style="font-size: 3rem; font-weight: 800; font-family: 'JetBrains Mono', monospace; color: var(--primary); margin: 0.5rem 0;">
            \${percentage}%
          </div>
          <div style="font-size: 1.1rem; font-weight: 700; margin-bottom: 1.5rem;">Grade: \${grade}</div>

          <div class="stats-row">
            <div class="stat-box">
              <div class="stat-num" style="color: var(--primary);">\${total}</div>
              <div class="stat-label">Total Questions</div>
            </div>
            <div class="stat-box">
              <div class="stat-num" style="color: var(--success);">\${correct}</div>
              <div class="stat-label">Correct</div>
            </div>
            <div class="stat-box">
              <div class="stat-num" style="color: var(--error);">\${wrong}</div>
              <div class="stat-label">Wrong</div>
            </div>
            <div class="stat-box">
              <div class="stat-num" style="color: var(--text-muted);">\${unattempted}</div>
              <div class="stat-label">Unanswered</div>
            </div>
          </div>

          <div style="display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap; margin-top: 1.5rem;">
            <button class="btn btn-primary" onclick="startQuiz(selectedTopic)">🔄 Retake This Quiz</button>
            <button class="btn" onclick="renderHome()">🏠 Back to Topics</button>
          </div>
        </div>
      \`;
    }

    function showHome() {
      renderHome();
    }

    window.onload = init;
  </script>
</body>
</html>`;
}
