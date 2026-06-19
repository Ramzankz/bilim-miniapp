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
      <h2 className="result-msg">{msg}</h2>

      <div className="result-score">
        {score} / {total}
        <span className="result-pct"> ({pct}%)</span>
      </div>

      {coinsEarned > 0 && (
        <div className="coins-earned-card">
          🪙 +{coinsEarned} {t("тиын жиналды!", "монет заработано!")}
          <p className="coins-total">{t(`Жалпы: ${totalCoins} тиын`, `Итого: ${totalCoins} монет`)}</p>
        </div>
      )}

      <div className="result-actions">
        <button className="retry-btn" onClick={onRetry}>
          🔄 {t("Қайталау", "Повторить")}
        </button>
        <button className="back-btn-result" onClick={onBack}>
          {t("Сабақтарға оралу", "К урокам")}
        </button>
      </div>
    </div>
  );
}
