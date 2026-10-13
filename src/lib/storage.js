// 札ごとの正解・不正解の回数をローカルストレージに保存します。
// 形式: { [札のid]: { correct: number, wrong: number, last: ISO文字列 } }

const KEY = 'jomo-karuta:stats:v1';

export function loadStats() {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return {};
    const data = JSON.parse(raw);
    return data && typeof data === 'object' && !Array.isArray(data) ? data : {};
  } catch {
    return {};
  }
}

export function saveStats(stats) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(stats));
  } catch {
    // プライベートモードや容量超過では保存せずに続行する
  }
}

export function applyAnswer(stats, id, isCorrect) {
  const prev = stats[id] ?? { correct: 0, wrong: 0 };
  return {
    ...stats,
    [id]: {
      correct: prev.correct + (isCorrect ? 1 : 0),
      wrong: prev.wrong + (isCorrect ? 0 : 1),
      last: new Date().toISOString(),
    },
  };
}

export function clearStats() {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    // 何もしない
  }
}
