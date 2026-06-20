import { useState, useEffect, useCallback } from "react";

const SETS = [
  ["🦁","🐬","🐆","🦊","🐻","🐘","🦋","🐮"],
  ["🍎","🍌","🍓","🍇","🍉","🍐","🍒","🍈"],
  ["♥️","♦️","♠️","♣️","🌟","💥","🌀","🔥"],
];

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }

function initCards(setIdx) {
  const emojis = SETS[setIdx % SETS.length];
  return shuffle([...emojis, ...emojis].map((e, i) => ({ id: i, emoji: e, flipped: false, matched: false })));
}

export default function MemoryGame({ lang, t, onBack, onEarn }) {
  const [level, setLevel] = useState(0);
  const [cards, setCards] = useState(() => initCards(0));
  const [selected, setSelected] = useState([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [won, setWon] = useState(false);
  const [locked, setLocked] = useState(false);

  const total = cards.length / 2;

  const handleFlip = useCallback((card) => {
    if (locked || card.flipped || card.matched) return;
    if (selected.length === 1 && selected[0].id === card.id) return;

    const newFlip = { ...card, flipped: true };
    setCards(prev => prev.map(c => c.id === card.id ? newFlip : c));
    const newSel = [...selected, newFlip];
    setSelected(newSel);

    if (newSel.length === 2) {
      setMoves(m => m + 1);
      setLocked(true);
      if (newSel[0].emoji === newSel[1].emoji) {
        setTimeout(() => {
          setCards(prev => prev.map(c =>
            c.emoji === newSel[0].emoji ? { ...c, matched: true } : c
          ));
          const nm = matches + 1;
          setMatches(nm);
          if (nm === total) { setWon(true); onEarn(20); }
          setSelected([]);
          setLocked(false);
        }, 500);
      } else {
        setTimeout(() => {
          setCards(prev => prev.map(c =>
            (c.id === newSel[0].id || c.id === newSel[1].id) ? { ...c, flipped: false } : c
          ));
          setSelected([]);
          setLocked(false);
        }, 900);
      }
    }
  }, [locked, selected, matches, total, onEarn]);

  const restart = (lv) => {
    setLevel(lv);
    setCards(initCards(lv));
    setSelected([]);
    setMoves(0);
    setMatches(0);
    setWon(false);
    setLocked(false);
  };

  return (
    <div className="screen game-screen">
      <div className="game-header">
        <button className="back-btn" onClick={onBack}>✕</button>
        <h2>{t("🧠 Есте сақтау", "🧠 Память")}</h2>
        <span className="game-stat">{matches}/{total} | {t("қадам","ход")}: {moves}</span>
      </div>

      {won ? (
        <div className="win-screen">
          <div className="win-icon">🥇</div>
          <h2>{t("Жеңдің!", "Победа!")}</h2>
          <p>{t(`${moves} қадамда тауып шықтың! +20 🪙`, `Нашёл за ${moves} ходов! +20 🪙`)}</p>
          <button className="next-btn" onClick={() => restart(level + 1)}>
            {t("🔄 Жаңа ойын","Новая игра")}
          </button>
        </div>
      ) : (
        <div className="memory-grid">
          {cards.map(card => (
            <button
              key={card.id}
              className={`mem-card${card.flipped || card.matched ? " open" : ""}${card.matched ? " matched" : ""}`}
              onClick={() => handleFlip(card)}
            >
              <span className="mem-front">{card.emoji}</span>
              <span className="mem-back">❓</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
