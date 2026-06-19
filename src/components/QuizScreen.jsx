import { useState } from "react";

export default function QuizScreen({ lang, t, lesson, onDone, onBack, coins }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showCoin, setShowCoin] = useState(false);

  const questions = lesson.questions;
  const q = questions[current];

  const handleAnswer = (idx) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    if (idx === q.correct) {
      setScore((s) => s + 1);
      setShowCoin(true);
      setTimeout(() => setShowCoin(false), 1000);
    }
  };

  const handleNext = () => {
    if (current + 1 < questions.length) {
      setCurrent((c) => c + 1); setSelected(null); setAnswered(false);
    } else {
      onDone({ score: score + (selected === q.correct ? 1 : 0), total: questions.length, lesson });
    }
  };

  const getOptionLabel = (opt) => typeof opt === "object" ? opt[lang] : opt;
  const progress = (current / questions.length) * 100;
  const isCorrect = answered && selected === q.correct;

  return (
    <div className="screen quiz-screen">
      {showCoin && <div className="coin-popup">+10 Coin</div>}
      <div className="quiz-header">
        <button className="back-btn" onClick={onBack}>X</button>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <span className="progress-label">{current + 1}/{questions.length}</span>
        <span className="quiz-coins">C{coins}</span>
      </div>
      <div className={`question-card ${isCorrect ? "correct-bg" : ""}`}>
        <div className="lesson-emoji-big">{lesson.emoji}</div>
        <p className="question-text">{q.text[lang]}</p>
      </div>
      <div className="options-list">
        {q.options.map((opt, idx) => {
          let cls = "option-btn";
          if (answered) {
            if (idx === q.correct) cls += " correct";
            else if (idx === selected) cls += " wrong";
          }
          return (
            <button key={idx} className={cls} onClick={() => handleAnswer(idx)}>
              {answered && idx === q.correct && "OK "}
              {answered && idx === selected && idx !== q.correct && "X "}
              {getOptionLabel(opt)}
            </button>
          );
        })}
      </div>
      {answered && (
        <div className={`explanation ${isCorrect ? "good" : "bad"}`}>
          <strong>{isCorrect ? t("Durys! +10 Coin", "Verno! +10 Coin") : t("Qate. Biraq bu da oqu!", "Neverno. No eto tozhe uchyoba!")}</strong>
          <p>{q.explanation[lang]}</p>
        </div>
      )}
      {answered && (
        <button className="next-btn" onClick={handleNext}>
          {current + 1 < questions.length ? t("Kelesi ->", "Dalshe ->") : t("Natizhe Trophy", "Rezultat Trophy")}
        </button>
      )}
    </div>
  );
}import { useState } from "react";

export default function QuizScreen({ lang, t, lesson, onDone, onBack }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);

  const questions = lesson.questions;
  const q = questions[current];

  const handleAnswer = (idx) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    if (idx === q.correct) setScore((s) => s + 1);
  };

  const handleNext = () => {
    if (current + 1 < questions.length) {
      setCurrent((c) => c + 1);
      setSelected(null);
      setAnswered(false);
    } else {
      onDone({ score: score + (selected === q.correct ? 1 : 0), total: questions.length, lesson });
    }
  };

  const getOptionLabel = (opt) => {
    if (typeof opt === "object") return opt[lang];
    return opt;
  };

  const progress = ((current) / questions.length) * 100;

  return (
    <div className="screen quiz-screen">
      <div className="quiz-header">
        <button className="back-btn" onClick={onBack}>✕</button>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <span className="progress-label">{current + 1}/{questions.length}</span>
      </div>

      <div className="question-card">
        <div className="lesson-emoji-big">{lesson.emoji}</div>
        <p className="question-text">{q.text[lang]}</p>
      </div>

      <div className="options-list">
        {q.options.map((opt, idx) => {
          let cls = "option-btn";
          if (answered) {
            if (idx === q.correct) cls += " correct";
            else if (idx === selected) cls += " wrong";
          }
          return (
            <button key={idx} className={cls} onClick={() => handleAnswer(idx)}>
              {getOptionLabel(opt)}
            </button>
          );
        })}
      </div>

      {answered && (
        <div className={`explanation ${selected === q.correct ? "good" : "bad"}`}>
          <span>{selected === q.correct ? "🎉 " : "❌ "}</span>
          {q.explanation[lang]}
        </div>
      )}

      {answered && (
        <button className="next-btn" onClick={handleNext}>
          {current + 1 < questions.length
            ? t("Келесі →", "Дальше →")
            : t("Нәтижені көру 🏆", "Посмотреть результат 🏆")}
        </button>
      )}
    </div>
  );
}
