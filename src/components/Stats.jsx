// 札ごとの正解回数・不正解回数の一覧。
export default function Stats({ cards, stats, onReset }) {
  const learned = cards.filter((c) => (stats[c.id]?.correct ?? 0) > 0).length;

  const handleReset = () => {
    if (window.confirm('すべての記録を消します。よろしいですか?')) onReset();
  };

  return (
    <section className="panel">
      <h2>記録</h2>
      <p className="summary">
        1回以上正解した札: <strong>{learned}</strong> / {cards.length} 枚
      </p>
      <table className="stats-table">
        <thead>
          <tr>
            <th scope="col">札</th>
            <th scope="col">取り札</th>
            <th scope="col" className="num">正解</th>
            <th scope="col" className="num">不正解</th>
          </tr>
        </thead>
        <tbody>
          {cards.map((c) => {
            const s = stats[c.id] ?? { correct: 0, wrong: 0 };
            return (
              <tr key={c.id} className={s.correct === 0 ? 'unlearned' : undefined}>
                <th scope="row">{c.kana}</th>
                <td>{c.tori}</td>
                <td className="num">{s.correct}</td>
                <td className="num">{s.wrong}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <button type="button" className="btn danger" onClick={handleReset}>
        記録をリセット
      </button>
      <p className="note">記録はこのブラウザのローカルストレージにだけ保存されます。</p>
    </section>
  );
}
