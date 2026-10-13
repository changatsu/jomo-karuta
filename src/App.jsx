import { useCallback, useState } from 'react';
import { cards, usingSample, totalCardCount } from './data/index.js';
import { applyAnswer, clearStats, loadStats, saveStats } from './lib/storage.js';
import Practice from './components/Practice.jsx';
import Quiz from './components/Quiz.jsx';
import Stats from './components/Stats.jsx';

const TABS = [
  { id: 'practice', label: '練習' },
  { id: 'quiz', label: 'テスト' },
  { id: 'stats', label: '記録' },
];

export default function App() {
  const [tab, setTab] = useState('practice');
  const [stats, setStats] = useState(loadStats);

  const recordAnswer = useCallback((id, isCorrect) => {
    setStats((prev) => {
      const next = applyAnswer(prev, id, isCorrect);
      saveStats(next);
      return next;
    });
  }, []);

  const resetStats = useCallback(() => {
    clearStats();
    setStats({});
  }, []);

  return (
    <div className="app">
      <header className="header">
        <h1>上毛かるた</h1>
        <nav className="tabs" aria-label="モード切り替え">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              className={tab === t.id ? 'tab active' : 'tab'}
              aria-current={tab === t.id ? 'page' : undefined}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </header>

      {usingSample && (
        <p className="banner">
          札のデータが未入力のため、サンプル札を表示しています。
          <code>src/data/cards.js</code> に読み札・取り札を入力してください。
        </p>
      )}
      {!usingSample && cards.length < totalCardCount && (
        <p className="banner">
          入力済みの {cards.length} 枚のみ出題しています(全 {totalCardCount} 枚)。
        </p>
      )}

      <main>
        {tab === 'practice' && <Practice cards={cards} />}
        {tab === 'quiz' && <Quiz cards={cards} onAnswer={recordAnswer} />}
        {tab === 'stats' && <Stats cards={cards} stats={stats} onReset={resetStats} />}
      </main>
    </div>
  );
}
