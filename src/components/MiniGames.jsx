import { useState } from "react";
import MemoryGame from "./games/MemoryGame";
import QuickMath from "./games/QuickMath";

const GAMES = [
  { id: "memory", emoji: "🧠", nameKz: "Есте сақтау", nameRu: "Память",       descKz: "Жұптарды тап!", descRu: "Найди пары!", color: "#a29bfe" },
  { id: "math",   emoji: "⚡",        nameKz: "Жылдам санау", nameRu: "Быстрый счёт", descKz: "8 секундта шеш!", descRu: "8 секунд на ответ!", color: "#fdcb6e" },
  { id: "coming", emoji: "🔥", nameKz: "Сөз лабиринт", nameRu: "Лабиринт слов", descKz: "Жақында...", descRu: "Скоро...", color: "#dfe6e9", disabled: true },
  { id: "coming2",emoji: "🎮", nameKz: "Логика ойын", nameRu: "Логика",          descKz: "Жақында...", descRu: "Скоро...", color: "#dfe6e9", disabled: true },
];

export default function MiniGames({ lang, t, onBack, onEarn }) {
  const [active, setActive] = useState(null);

  if (active === "memory") return <MemoryGame lang={lang} t={t} onBack={() => setActive(null)} onEarn={onEarn} />;
  if (active === "math")   return <QuickMath  lang={lang} t={t} onBack={() => setActive(null)} onEarn={onEarn} />;

  return (
    <div className="screen minigames-screen">
      <div className="game-header">
        <button className="back-btn" onClick={onBack}>✕</button>
        <h2>{t("🎮 Мини ойындар", "🎮 Мини-игры")}</h2>
        <span />
      </div>
      <p className="shop-subtitle">{t("Ойын таңда:", "Выбери игру:")}</p>
      <div className="games-grid">
        {GAMES.map(g => (
          <button
            key={g.id}
            className={`game-card${g.disabled ? " disabled" : ""}`}
            onClick={() => !g.disabled && setActive(g.id)}
          >
            <span className="game-emoji">{g.emoji}</span>
            <span className="game-name">{lang === "kz" ? g.nameKz : g.nameRu}</span>
            <span className="game-desc">{lang === "kz" ? g.descKz : g.descRu}</span>
            {g.disabled && <span className="coming-tag">{t("Жақында","Скоро")}</span>}
          </button>
        ))}
      </div>
    </div>
  );
}
