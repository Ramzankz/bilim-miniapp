export default function Home({ lang, t, onAgeSelect, streak, coins }) {
  return (
    <div className="screen home-screen">
      {streak > 1 && (
        <div className="streak-banner">
          🔥 {streak} {t("күн қатарынан!", "дней подряд!")}
          {streak >= 7 && " 🏆"}
        </div>
      )}

      <div className="logo">🦁</div>
      <h1 className="app-title">{t("Білім!", "Bilim!")}</h1>
      <p className="app-subtitle">
        {t(
          "Логика және математика — қызықты тапсырмалармен!",
          "Логика и математика — через интересные задачи!"
        )}
      </p>

      {coins > 0 && (
        <div className="coins-banner">
          🪙 {t(`Сізде ${coins} тиын бар!`, `У вас ${coins} монет!`)}
        </div>
      )}

      <p className="choose-label">{t("Жасты таңда:", "Выбери возраст:")}</p>

      <div className="age-cards">
        <button className="age-card" onClick={() => onAgeSelect("4-6")}>
          <span className="age-emoji">🐣</span>
          <span className="age-range">4 – 6</span>
          <span className="age-label">{t("жас", "лет")}</span>
          <span className="age-desc">{t("Санау, фигуралар, түстер", "Счёт, фигуры, цвета")}</span>
        </button>

        <button className="age-card" onClick={() => onAgeSelect("7-10")}>
          <span className="age-emoji">🦅</span>
          <span className="age-range">7 – 10</span>
          <span className="age-label">{t("жас", "лет")}</span>
          <span className="age-desc">{t("Математика, логика, есептер", "Математика, логика, задачи")}</span>
        </button>
      </div>

      <div className="home-badges">
        <p className="free-badge">🎁 {t("5 сабақ — тегін!", "5 уроков — бесплатно!")}</p>
        <p className="coin-badge">🪙 {t("Жауап үшін тиын жина!", "Зарабатывай монеты!")}</p>
      </div>
    </div>
  );
}
