import { useState } from 'react';
import { shuffle } from '../lib/shuffle.js';

const CHOICE_COUNT = 4;

function buildQuestions(cards, count) {
  return shuffle(cards)
    .slice(0, count)
    .map((card) => {
      const others = shuffle(cards.filter((c) => c.id !== card.id)).slice(0, CHOICE_COUNT - 1);
      return { card, choices: shuffle([card, ...others]) };
    });
}

// テストモード。読み札を見て、正しい取り札を選ぶ。
export default function Quiz({ cards, onAnswer }) {
  // 選べる問題数: 10枚・20枚(札の枚数より少ない場合のみ)と、全部
  const countOptions = [10, 20]
    .filter((n) => n < cards.length)
    .map((n) => ({ value: n, label: `${n}枚` }));
  countOptions.push({ value: cards.length, label: `全部(${cards.length}枚)` });

  const [phase, setPhase] = useState('setup'); // 'setup' | 'playing' | 'result'
  const [count, setCount] = useState(countOptions[0].value);
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [selectedId, setSelectedId] = useState(null);
  const [answers, setAnswers] = useState([]);

  const start = (n) => {
    setQuestions(buildQuestions(cards, n));
    setIndex(0);
    setSelectedId(null);
    setAnswers([]);
    setPhase('playing');
  };

  const choose = (choice) => {
    if (selectedId !== null) return;
    const q = questions[index];
    const correct = choice.id === q.card.id;
    setSelectedId(choice.id);
    setAnswers((a) => [...a, { card: q.card, correct }]);
    onAnswer(q.card.id, correct);
  };

  const next = () => {
    if (index + 1 >= questions.length) {
      setPhase('result');
    } else {
      setIndex((i) => i + 1);
      setSelectedId(null);
    }
  };

  if (phase === 'setup') {
    return (
      <section className="panel">
        <h2>テスト</h2>
        <p>読み札を見て、正しい取り札を選びます。</p>
        <fieldset className="segmented wide">
          <legend>問題数</legend>
          {countOptions.map((o) => (
            <button
              key={o.value}
              type="button"
              className={count === o.value ? 'seg active' : 'seg'}
              onClick={() => setCount(o.value)}
            >
              {o.label}
            </button>
          ))}
        </fieldset>
        <button type="button" className="btn primary large" onClick={() => start(count)}>
          はじめる
        </button>
      </section>
    );
  }

  if (phase === 'playing') {
    const q = questions[index];
    const answered = selectedId !== null;
    const isLast = index + 1 >= questions.length;

    return (
      <section className="panel">
        <p className="progress">
          {index + 1} / {questions.length}
        </p>
        <div className="question">
          <span className="face-label">読み札</span>
          <p className="face-text">{q.card.yomi}</p>
        </div>
        <ul className="choices">
          {q.choices.map((c) => {
            let cls = 'choice';
            if (answered && c.id === q.card.id) cls += ' correct';
            else if (answered && c.id === selectedId) cls += ' wrong';
            return (
              <li key={c.id}>
                <button type="button" className={cls} disabled={answered} onClick={() => choose(c)}>
                  {c.tori}
                </button>
              </li>
            );
          })}
        </ul>
        {answered && (
          <div className="feedback" role="status">
            <p className={selectedId === q.card.id ? 'ok' : 'ng'}>
              {selectedId === q.card.id ? '正解!' : `不正解… 正しくは「${q.card.kana}」の札`}
            </p>
            {q.card.note && <p className="note">{q.card.note}</p>}
            <button type="button" className="btn primary" onClick={next}>
              {isLast ? '結果を見る' : '次へ →'}
            </button>
          </div>
        )}
      </section>
    );
  }

  const score = answers.filter((a) => a.correct).length;
  const missed = answers.filter((a) => !a.correct);
  const percent = Math.round((score / answers.length) * 100);

  return (
    <section className="panel">
      <h2>結果</h2>
      <p className="score">
        {score} <span>/ {answers.length}</span>
        <small>({percent}%)</small>
      </p>
      {missed.length > 0 ? (
        <>
          <h3>まちがえた札</h3>
          <ul className="missed">
            {missed.map(({ card }) => (
              <li key={card.id}>
                <strong>
                  {card.kana}:{card.tori}
                </strong>
                <span>{card.yomi}</span>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="ok">全問正解です!</p>
      )}
      <div className="nav-row">
        <button type="button" className="btn" onClick={() => setPhase('setup')}>
          設定に戻る
        </button>
        <button type="button" className="btn primary" onClick={() => start(questions.length)}>
          もう一度
        </button>
      </div>
    </section>
  );
}
