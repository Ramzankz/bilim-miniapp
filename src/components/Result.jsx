export default function Result({ lang, t, result, lesson, onBack, onRetry, totalCoins }) {
  const { score, total, coinsEarned } = result;
  const percent = Math.round((score / total) * 100);

  const getMessage = () => {
    if (percent === 100) return t("Tamasha! Barlygy durys! Trophy", "Otlichno! Vsyo verno! Trophy");
    if (percent >= 66) return t("Zhaqsy natizhe! Star", "Khoroshiy rezultat! Star");
    if (percent >= 33) return t("Zhattygu kerek, zhasay alasyn! Strong", "Nuzhna praktika, ty spravishsya! Strong");
    return t("Qaytalap kor! Retry", "Poprobuy eshchyo raz! Retry");
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
            <strong>+{coinsEarned} {t("tiyn zhinалды!", "monet zarabotano!")}</strong>
            <p>{t(`Barlygy: ${totalCoins} Coin`, `Vsego: ${totalCoins} Coin`)}</p>
          </div>
        </div>
      )}

      <div className="result-actions">
        <button className="retry-btn" onClick={onRetry}>
          Retry {t("Qaytalau", "Povtorit")}
        </button>
        <button className="back-btn-big" onClick={onBack}>
          Book {t("Sabaqtarqa", "K urokam")}
        </button>
      </div>
    </div>
  );
}
