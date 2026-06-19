export default function Result({ lang, t, result, lesson, onBack, onRetry, totalCoins }) {
  const { score, total, coinsEarned } = result;
  const percent = Math.round((score / total) * 100);

  const getMessage = () => {
    if (percent === 100) return t("Tamasha! Barlygy durys! Trophy", "Otlichno! Vsyo verno! Trophy");
    if (percent >= 66) return t("Zhaqsy natizhe! Star", "Khoroshiy rezultat! Star");
    if (percent >= 33) return t("Zhattyghu kerek, zhasay alasyn! Muscle", "Nuzhna praktika, ty spravishsya! Muscle");
    return t("Qaytalap kor! Refresh", "Poprobuy eshche raz! Refresh");
  };

  const getEmoji = () => {
    if (percent === 100) return "Gold";
    if (percent >= 66) return "Silver";
    if (percent >= 33) return "Bronze";
    return "Book";
  };

  return (
    <div className="screen result-screen">
      <div className="result-icon">{getEmoji()}</div>
      <h2 className="result-title">{t("Natizhe", "Rezultat")}</h2>
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

      {coinsEarned > 0 && (
        <div className="coins-earned-card">
          <span className="coins-earned-icon">Coin</span>
          <div>
            <strong>+{coinsEarned} {t("tiyn zhynaldy!", "monet zarabotano!")}</strong>
            <p>{t(`Barlygy: ${totalCoins} Coin`, `Vsego: ${totalCoins} Coin`)}</p>
          </div>
        </div>
      )}

      <div className="result-actions">
        <button className="retry-btn" onClick={onRetry}>Refresh {t("Qaytalau", "Povtorit")}</button>
        <button className="back-btn-big" onClick={onBack}>Book {t("Sabaqtarga", "K urokam")}</button>
      </div>
    </div>
  );
}export default function Result({ lang, t, result, lesson, onBack, onRetry }) {
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
