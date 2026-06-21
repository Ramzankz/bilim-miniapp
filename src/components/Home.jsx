import { getLevel, getXpPercent } from "../data/gamification";

const AVATAR_EMOJI = {
  a: "🐱", b: "🐶", c: "🦊", d: "🐸", e: "🦄", f: "🐯",
  lion: "🦁", crown: "👑", rocket: "🚀", magic: "🧙", star: "🌟", dragon: "🐉",
};

const AGE_GROUPS = [
  { id: "4-6",   emoji: "🧸", label: "4–6" },
  { id: "7-9",   emoji: "🚀", label: "7–9" },
  { id: "10-13", emoji: "🔬", label: "10–13" },
];

export default function Home({
  lang, t, onAgeSelect, streak, coins, avatar,
  onShop, onParent, onRiddles, onGames,
  onProfile, onMissions, onLeaderboard, onElla,
  xp, achievements, onLangToggle,
}) {
  const level = getLevel(xp || 0);
  const xpPct = getXpPercent(xp || 0);
  const achCount = (achievements || []).length;
  return (
    <div className="home-screen">
      <div className="top-bar">
        <button className="avatar-btn" onClick={onProfile}>
          <span className="avatar-emoji">{AVATAR_EMOJI[avatar] || "🐱"}</span>
          <span className="level-chip">{level.emoji} {level.level}</span>
        </button>
        <div className="stats-row">
          <span className="stat-chip">🔥 {streak}</span>
          <span className="stat-chip">🪙 {coins}</span>
          <span className="stat-chip">⭐ {xp || 0} XP</span>
        </div>
        <div className="top-btns">
          <button className="lang-btn" onClick={onLangToggle}>{lang === "kz" ? "РУС" : "ҚАЗ"}</button>
          <button className="shop-icon-btn" onClick={onShop}>🛍️</button>
        </div>
      </div>
      <div className="home-xp-bar">
        <div className="home-xp-fill" style={{ width: xpPct + "%" }} />
      </div>
      <div className="logo-wrap">
        <h1 className="app-title">Білім!</h1>
        <p className="app-subtitle">{lang === "kz" ? "Ойнай отырып үйрен 🎓" : "Учись играя 🎓"}</p>
      </div>
      <p className="select-age-label">{t("Жасыңды таңда", "Выбери возраст")}</p>
      <div className="age-cards">
        {AGE_GROUPS.map(g => (
          <button key={g.id} className="age-card" onClick={() => onAgeSelect(g.id)}>
            <span className="age-emoji">{g.emoji}</span>
            <span className="age-label">{g.label}</span>
          </button>
        ))}
      </div>
      <div className="quick-btns">
        <button className="quick-btn qb-riddles" onClick={onRiddles}>🧩 {lang === "kz" ? "Жұмбақтар" : "Загадки"}</button>
        <button className="quick-btn qb-games" onClick={onGames}>🎮 {lang === "kz" ? "Ойындар" : "Игры"}</button>
      </div>
      <div className="feature-nav">
        <button className="feat-btn feat-missions" onClick={onMissions}>
          <span className="feat-icon">📋</span>
          <span className="feat-label">{lang === "kz" ? "Тапсырмалар" : "Задания"}</span>
        </button>
        <button className="feat-btn feat-leaderboard" onClick={onLeaderboard}>
          <span className="feat-icon">🏆</span>
          <span className="feat-label">{lang === "kz" ? "Рейтинг" : "Рейтинг"}</span>
        </button>
        <button className="feat-btn feat-ella" onClick={onElla}>
          <span className="feat-icon">🤖</span>
          <span className="feat-label">Ella AI</span>
        </button>
        <button className="feat-btn feat-ach" onClick={onProfile}>
          <span className="feat-icon">🏅</span>
          <span className="feat-label">{lang === "kz" ? "Жетістік " + achCount : "Бейджи " + achCount}</span>
        </button>
      </div>
      <button className="parent-btn" onClick={onParent}>
        👨‍👩‍👧 {lang === "kz" ? "Ата-ана кабинеті" : "Кабинет родителя"}
      </button>
    </div>
  );
}
