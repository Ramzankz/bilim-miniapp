export default function Home({ lang, t, onAgeSelect, streak, coins }) {
  return (
    <div className="screen home-screen">
      {streak > 1 && (
        <div className="streak-banner">
          Fire {streak} {t("kun qatarynan!", "dney podryad!")}
          {streak >= 7 && " Trophy"}
        </div>
      )}

      <div className="logo">Lion</div>
      <h1 className="app-title">{t("Bilim!", "Bilim!")}</h1>
      <p className="app-subtitle">
        {t(
          "Logika jane matematika - qyziqty tapsyrmalarmEN!",
          "Logika i matematika - cherez interesnye zadachi!"
        )}
      </p>

      {coins > 0 && (
        <div className="coins-banner">
          Coin {t(`Sizde ${coins} tiyn bar!`, `U vas ${coins} monet!`)}
        </div>
      )}

      <p className="choose-label">{t("Zasty tanda:", "Vyberi vozrast:")}</p>

      <div className="age-cards">
        <button className="age-card" onClick={() => onAgeSelect("4-6")}>
          <span className="age-emoji">Chick</span>
          <span className="age-range">4 - 6</span>
          <span className="age-label">{t("zhas", "let")}</span>
          <span className="age-desc">{t("Sanau, figuralar, tustar", "Schyot, figury, cveta")}</span>
        </button>

        <button className="age-card" onClick={() => onAgeSelect("7-10")}>
          <span className="age-emoji">Eagle</span>
          <span className="age-range">7 - 10</span>
          <span className="age-label">{t("zhas", "let")}</span>
          <span className="age-desc">{t("Matematika, logika, esepter", "Matematika, logika, zadachi")}</span>
        </button>
      </div>

      <div className="home-badges">
        <p className="free-badge">Gift {t("5 sabaq - tegin!", "5 urokov - besplatno!")}</p>
        <p className="coin-badge">Coin {t("Zhauyp ushin tiyn zhina!", "Zarabatyvay monety!")}</p>
      </div>
    </div>
  );
}
