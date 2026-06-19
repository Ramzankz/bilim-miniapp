export default function Result({ lang, t, result, lesson, onBack, onRetry }) {
  const { score, total } = result;
  const percent = Math.round((score / total) * 100);

  const getMessage = () => {
    if (percent === 100) return t("Тамаша! Барлығы дұрыс! 🏆", "Отлично! Всё верно! 🏆");
    if (percent >= 66) return t("Жақсы нәтиже! 🌟", "Хороший результат! 🌟");
    if (percent >= 33) return t("Жаттығу керек, жасай аласың! 💪", "Нужна практика, ты справишься! 💪");
    return t("Қайталап көр! 🔄", "Попробуй ещё раз! 🔄");
  };

  const getEmoji = () => {
    if (percent === 100) return "🥇";
    if (percent >= 66) return "🥈";
    if (percent >= 33) return "🥉";
    return "📚";
  };

  return (
    <div className="screen result-screen">
      <div className="result-icon">{getEmoji()}</div>
      <h2 className="result-title">{t("Нәтиже", "Результат")}</h2>

      <div className="score-circle">
        <span className="score-num">{score}</span>
        <span className="score-sep">/</span>
        <span className="score-total">{total}</span>
      </div>

      <div className="score-bar">
        <div className="score-fill" style={{ width: `${percent}%` }} />
      </div>
      <p className="score-percent">{percent}%</p>

      <p className="result-message">{getMessage()}</p>
      <p className="lesson-name">{lesson?.title?.[lang]}</p>

      <div className="result-actions">
        <button className="retry-btn" onClick={onRetry}>
          🔄 {t("Қайталау", "Повторить")}
        </button>
        <button className="back-btn-big" onClick={onBack}>
          📚 {t("Сабақтарға", "К урокам")}
        </button>
      </div>
    </div>
  );
}
