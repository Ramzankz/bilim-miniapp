import { useState, useEffect } from "react";

const WORDS = [
  { word: "МЕКТЕП",  hintKz: "Балалар оқитын жер",        hintRu: "Место где учатся дети" },
  { word: "КІТАП",   hintKz: "Оқуға арналған заттар",     hintRu: "Книга для чтения" },
  { word: "ҚАЛАМ",   hintKz: "Жазуға арналған құрал",     hintRu: "Пишущий инструмент" },
  { word: "ДӘПТЕР",  hintKz: "Жазуға арналған дәптер",    hintRu: "Тетрадь для записей" },
  { word: "МҰҒАЛІМ", hintKz: "Балаларға сабақ беретін адам", hintRu: "Учитель" },
  { word: "АЛМА",    hintKz: "Қызыл немесе жасыл жеміс", hintRu: "Красный или зелёный фрукт" },
  { word: "БАЛЫҚ",   hintKz: "Суда тіршілік ететін жан",  hintRu: "Живёт в воде" },
  { word: "БҰЛТ",    hintKz: "Аспандағы ақ зат",          hintRu: "Белое в небе" },
  { word: "ЖҰЛДЫЗ",  hintKz: "Түнде жарқырайды",          hintRu: "Светит ночью в небе" },
  { word: "ГҮЛ",     hintKz: "Хош иісті өсімдік",         hintRu: "Цветущее растение" },
  { word: "АЙ",      hintKz: "Түнгі жарық",               hintRu: "Ночное светило" },
  { word: "КҮН",     hintKz: "Жарқыраған жарық шар",      hintRu: "Горящая звезда" },
  { word: "СУ",      hintKz: "H₂O",                       hintRu: "H₂O, жидкость" },
  { word: "ОТ",      hintKz: "Жылытатын, жағатын нәрсе",  hintRu: "Огонь" },
  { word: "АРЫСТАН", hintKz: "Тіршілік патшасы",           hintRu: "Царь зверей" },
];

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function WordGame({ lang, onBack, onWin }) {
  const [wordIndex, setWordIndex] = useState(0);
  const [scrambled, setScrambled] = useState([]);
  const [selected, setSelected] = useState([]);
  const [score, setScore] = useState(0);
  const [phase, setPhase] = useState("play"); // play | win | done
  const [shakeWrong, setShakeWrong] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const totalWords = 5;
  const wordSet = WORDS.slice(0, totalWords);

  useEffect(() => {
    if (wordIndex < wordSet.length) {
      const letters = wordSet[wordIndex].word.split("");
      setScrambled(shuffle(letters).map((l, i) => ({ l, id: i, used: false })));
      setSelected([]);
      setShowHint(false);
    }
  }, [wordIndex]);

  const current = wordSet[wordIndex];

  const tapLetter = (item) => {
    if (item.used || phase !== "play") return;
    const nextSel = [...selected, item];
    setSelected(nextSel);
    const newScrambled = scrambled.map(s => s.id === item.id ? { ...s, used: true } : s);
    setScrambled(newScrambled);

    // Check if full word is formed
    if (nextSel.length === current.word.length) {
      const formed = nextSel.map(s => s.l).join("");
      if (formed === current.word) {
        setScore(s => s + 1);
        setTimeout(() => {
          if (wordIndex + 1 >= wordSet.length) {
            setPhase("done");
          } else {
            setWordIndex(i => i + 1);
            setPhase("play");
          }
        }, 600);
        setPhase("correct");
      } else {
        setShakeWrong(true);
        setTimeout(() => {
          setShakeWrong(false);
          // Reset
          const resetScrambled = scrambled.map(s => ({ ...s, used: false }));
          setScrambled(resetScrambled);
          setSelected([]);
        }, 800);
      }
    }
  };

  const removeLetter = (idx) => {
    const removed = selected[idx];
    setSelected(selected.filter((_, i) => i !== idx));
    setScrambled(scrambled.map(s => s.id === removed.id ? { ...s, used: false } : s));
  };

  if (phase === "done") {
    const perfect = score === totalWords;
    if (perfect) {
      onWin && onWin(20);
      const won = parseInt(localStorage.getItem("bilim_wordWins") || "0") + 1;
      localStorage.setItem("bilim_wordWins", won);
      const gamesWon = parseInt(localStorage.getItem("bilim_gamesWon") || "0") + 1;
      localStorage.setItem("bilim_gamesWon", gamesWon);
    }
    return (
      <div className="win-screen">
        <div className="win-emoji">{perfect ? "🎉" : "📝"}</div>
        <div className="win-title">{lang === "kz" ? "Ойын аяқталды!" : "Игра окончена!"}</div>
        <div className="win-score">{score}/{totalWords}</div>
        <div className="win-coins">{perfect ? (lang === "kz" ? "Мінсіз! +20 🪙" : "Отлично! +20 🪙") : (lang === "kz" ? "Жаман емес!" : "Неплохо!")}</div>
        <button className="retry-btn" onClick={() => { setWordIndex(0); setScore(0); setPhase("play"); }}>
          🔄 {lang === "kz" ? "Қайта ойна" : "Играть снова"}
        </button>
        <button className="back-btn" style={{marginTop:"10px"}} onClick={onBack}>
          ← {lang === "kz" ? "Артқа" : "Назад"}
        </button>
      </div>
    );
  }

  return (
    <div className="word-game-screen">
      <button className="back-btn" onClick={onBack}>← {lang === "kz" ? "Артқа" : "Назад"}</button>

      <div className="wg-header">
        <h2 className="wg-title">🔤 {lang === "kz" ? "Сөз ойыны" : "Слово игра"}</h2>
        <div className="wg-progress">{wordIndex + 1}/{totalWords} · ✅ {score}</div>
      </div>

      <div className="wg-hint-card">
        <button className="wg-hint-btn" onClick={() => setShowHint(!showHint)}>
          💡 {lang === "kz" ? "Кеңес" : "Подсказка"}
        </button>
        {showHint && (
          <div className="wg-hint-text">
            {lang === "kz" ? current.hintKz : current.hintRu}
          </div>
        )}
      </div>

      <div className={`wg-answer-row ${shakeWrong ? "wg-shake" : ""} ${phase === "correct" ? "wg-correct" : ""}`}>
        {Array.from({ length: current.word.length }, (_, i) => (
          <div
            key={i}
            className={`wg-letter-slot ${selected[i] ? "filled" : "empty"}`}
            onClick={() => selected[i] && removeLetter(i)}
          >
            {selected[i]?.l || ""}
          </div>
        ))}
      </div>

      {phase === "correct" && (
        <div className="wg-correct-msg">✅ {lang === "kz" ? "Дұрыс!" : "Правильно!"}</div>
      )}

      <div className="wg-letters">
        {scrambled.map(item => (
          <button
            key={item.id}
            className={`wg-letter-btn ${item.used ? "used" : ""}`}
            onClick={() => tapLetter(item)}
            disabled={item.used}
          >
            {item.l}
          </button>
        ))}
      </div>

      <button
        className="wg-clear-btn"
        onClick={() => {
          const resetScrambled = scrambled.map(s => ({ ...s, used: false }));
          setScrambled(resetScrambled);
          setSelected([]);
        }}
      >
        ✗ {lang === "kz" ? "Өшіру" : "Сброс"}
      </button>
    </div>
  );
}
