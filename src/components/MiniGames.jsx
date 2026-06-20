import { useState } from "react";
import MemoryGame from "./games/MemoryGame";
import QuickMath from "./games/QuickMath";
import WordGame from "./games/WordGame";

export default function MiniGames({ lang, onBack, onWin, onAddCoins, onUpdateMission }) {
  const [game, setGame] = useState(null);

  const handleWin = (coins) => {
    onWin && onWin(coins);
    onUpdateMission && onUpdateMission("memoryWins");
  };

  const handleMathWin = (coins, correct) => {
    onWin && onWin(coins);
    onUpdateMission && onUpdateMission("mathCorrect", correct);
  };

  const handleWordWin = (coins) => {
    onWin && onWin(coins);
    onUpdateMission && onUpdateMission("wordWins");
  };

  if (game === "memory") return <MemoryGame lang={lang} onBack={() => setGame(null)} onWin={handleWin} />;
  if (game === "math")   return <QuickMath  lang={lang} onBack={() => setGame(null)} onWin={handleMathWin} />;
  if (game === "word")   return <WordGame   lang={lang} onBack={() => setGame(null)} onWin={handleWordWin} />;

  return (
    <div className="games-screen">
      <button className="back-btn" onClick={onBack}>← {lang === "kz" ? "Артқа" : "Назад"}</button>
      <h2 className="games-title">🎮 {lang === "kz" ? "Ойындар" : "Игры"}</h2>

      <div className="games-grid">
        <button className="game-card" onClick={() => setGame("memory")}>
          <span className="game-icon">🧠</span>
          <span className="game-name">{lang === "kz" ? "Есте сақтау" : "Память"}</span>
          <span className="game-desc">+20 🪙</span>
        </button>
        <button className="game-card" onClick={() => setGame("math")}>
          <span className="game-icon">⚡</span>
          <span className="game-name">{lang === "kz" ? "Жылдам санау" : "Быстрый счёт"}</span>
          <span className="game-desc">+3 🪙/сұрақ</span>
        </button>
        <button className="game-card" onClick={() => setGame("word")}>
          <span className="game-icon">🔤</span>
          <span className="game-name">{lang === "kz" ? "Сөз ойыны" : "Слово игра"}</span>
          <span className="game-desc">+20 🪙</span>
        </button>
        <div className="game-card game-coming">
          <span className="game-icon">🧩</span>
          <span className="game-name">{lang === "kz" ? "Логика ойын" : "Логика"}</span>
          <span className="coming-tag">{lang === "kz" ? "Жақында" : "Скоро"}</span>
        </div>
      </div>
    </div>
  );
}
