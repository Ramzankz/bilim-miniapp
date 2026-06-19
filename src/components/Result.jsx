export default function Result({ lang, t, result, lesson, onBack, onRetry, totalCoins }) {
  if (!result) return null;

  const { score, total, coinsEarned } = result;
  const pct = Math.round((score / total) * 100);

  let icon, msg;
  if (pct === 100) { icon = "🥇"; msg = t("🏆 Керемет! Бәрін дұрыс!", "🏆 Отлично! Всё верно!"); }
  else if (pct >= 70) { icon = "🥈"; msg = t("🌟 Жақсы нәтиже!", "🌟 Хороший результат!"); }
  else if (pct >= 40) { icon = "🥉"; msg = t("💪 Жалғастыр!", "💪 Продолжай!"); }
  else { icon = "📚"; msg = t("🔄 Қайта байқа!", "🔄 Попробуй ещё раз!"); }

  return (
    <div className="screen result-screen">
      <div className="result-icon">{icon}</div>
      <h2 className="result-message">{msg}</h2>

      <div className="score-circle">
        <span className="score-num">{score}</span>
        <span className="score-sep">/</span>
        <span className="score-total">{total}</span>
      </div>
      <p className="score-percent">{pct}%</p>

      {coinsEarned > 0 && (
        <div className="coins-earned-card">
          <span className="coins-earned-icon">🪙</span>
          <div>
            <strong>+{coinsEarned} {t("тиын жиналды!", "монет заработано!")}</strong>
            <p>{t(`Жалпы: ${totalCoins} тиын`, `Итого: ${totalCoins} монет`)}</p>
          </div>
        </div>
      )}

      <div className="result-actions">
        <button className="retry-btn" onClick={onRetry}>
          🔄 {t("Қайталау", "Повторить")}
        </button>
        <button className="back-btn-big" onClick={onBack}>
          {t("Сабақтарға", "К урокам")}
        </button>
      </div>
    </div>
  );
}
