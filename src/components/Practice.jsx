import { useEffect, useMemo, useState } from 'react';
import { shuffle } from '../lib/shuffle.js';

// 暗記用の練習モード。札を1枚ずつ表示し、タップで裏面を確認する。
export default function Practice({ cards }) {
  const [order, setOrder] = useState('kana'); // 'kana' | 'random'
  const [front, setFront] = useState('yomi'); // 先に見せる面: 'yomi' | 'tori'
  const [seed, setSeed] = useState(0);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const deck = useMemo(
    () => (order === 'random' ? shuffle(cards) : cards),
    [cards, order, seed],
  );
  const card = deck[index];

  const go = (delta) => {
    setIndex((i) => (i + delta + deck.length) % deck.length);
    setRevealed(false);
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const changeOrder = (value) => {
    setOrder(value);
    setSeed((s) => s + 1);
    setIndex(0);
    setRevealed(false);
  };

  const changeFront = (value) => {
    setFront(value);
    setRevealed(false);
  };

  if (!card) return <p>札がありません。</p>;

  const frontText = front === 'yomi' ? card.yomi : card.tori;
  const backText = front === 'yomi' ? card.tori : card.yomi;
  const frontLabel = front === 'yomi' ? '読み札' : '取り札';
  const backLabel = front === 'yomi' ? '取り札' : '読み札';

  return (
    <section className="panel">
      <div className="options">
        <fieldset className="segmented">
          <legend>並び順</legend>
          <button
            type="button"
            className={order === 'kana' ? 'seg active' : 'seg'}
            onClick={() => changeOrder('kana')}
          >
            あいうえお順
          </button>
          <button
            type="button"
            className={order === 'random' ? 'seg active' : 'seg'}
            onClick={() => changeOrder('random')}
          >
            ランダム
          </button>
        </fieldset>
        <fieldset className="segmented">
          <legend>最初に見る面</legend>
          <button
            type="button"
            className={front === 'yomi' ? 'seg active' : 'seg'}
            onClick={() => changeFront('yomi')}
          >
            読み札
          </button>
          <button
            type="button"
            className={front === 'tori' ? 'seg active' : 'seg'}
            onClick={() => changeFront('tori')}
          >
            取り札
          </button>
        </fieldset>
      </div>

      <p className="progress">
        {index + 1} / {deck.length}
      </p>

      <button
        type="button"
        className={revealed ? 'flashcard revealed' : 'flashcard'}
        onClick={() => setRevealed((r) => !r)}
        aria-label={revealed ? '裏面を隠す' : '裏面を見る'}
      >
        <span className="kana">{card.kana}</span>
        <span className="face-label">{frontLabel}</span>
        <span className="face-text">{frontText}</span>
        {revealed ? (
          <>
            <hr />
            <span className="face-label">{backLabel}</span>
            <span className="face-text answer">{backText}</span>
            {card.note && <span className="note">{card.note}</span>}
          </>
        ) : (
          <span className="hint">タップして答えを見る</span>
        )}
      </button>

      <div className="nav-row">
        <button type="button" className="btn" onClick={() => go(-1)}>
          ← 前へ
        </button>
        <button type="button" className="btn primary" onClick={() => go(1)}>
          次へ →
        </button>
      </div>
      {order === 'random' && (
        <button
          type="button"
          className="btn subtle"
          onClick={() => {
            setSeed((s) => s + 1);
            setIndex(0);
            setRevealed(false);
          }}
        >
          もう一度シャッフル
        </button>
      )}
    </section>
  );
}
