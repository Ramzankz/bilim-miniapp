import { useState } from "react";

// Ең жақсы дауысты таңдайды
function speak(text) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();

  const utter = () => {
    const u = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    // Орыс дауысын іздейді (кириллица үшін ең жақсы)
    const best = voices.find(v => v.lang === "ru-RU" && v.localService)
      || voices.find(v => v.lang === "ru-RU")
      || voices.find(v => v.lang.startsWith("ru"))
      || null;
    if (best) u.voice = best;
    u.lang = "ru-RU";
    u.rate = 0.75;   // баяу — түсінікті
    u.pitch = 1.0;
    u.volume = 1;
    window.speechSynthesis.speak(u);
  };

  // Дауыстар жүктелмесе, күтеді
  if (window.speechSynthesis.getVoices().length > 0) {
    utter();
  } else {
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.onvoiceschanged = null;
      utter();
    };
  }
}

export default function QuizScreen({ lang, t, lesson, onDone, onBack, coins }) {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [chosen, setChosen] = useState(null);
  const [coinPop, setCoinPop] = useState(false);

  const questions = lesson?.questions || [];
  const q = questions[current];

  const getOptionLabel = (opt) => {
    if (typeof opt === "string") return opt;
    return lang === "kz" ? opt.kz : opt.ru;
  };

  const handleAnswer = (idx) => {
    if (chosen !== null) return;
    setChosen(idx);
    if (idx === q.correct) {
      setScore((s) => s + 1);
      setCoinPop(true);
      setTimeout(() => setCoinPop(false), 1200);
    }
  };

  const handleNext = () => {
    window.speechSynthesis?.cancel();
    if (current + 1 < questions.length) {
      setCurrent((c) => c + 1);
      setChosen(null);
    } else {
      onDone({ score, total: questions.length });
    }
  };

  if (!q) return <div className="screen">{t("Сұрақтар жоқ", "Нет вопросов")}</div>;

  const questionText = lang === "kz" ? q.text?.kz : q.text?.ru;

  return (
    <div className="screen quiz-screen">
      <div className="quiz-header">
        <button className="back-btn" onClick={() => { window.speechSynthesis?.cancel(); onBack(); }}>✕</button>
        <span className="progress-label">{current + 1} / {questions.length}</span>
        <span className="quiz-coins">🪙 {coins}</span>
      </div>

      {coinPop && <div className="coin-popup">+10 🪙</div>}

      <div className="question-card">
        <p className="question-text">{questionText}</p>
        <button
          className="speak-btn"
          onClick={() => speak(questionText)}
          aria-label="Дауыстап оқу"
        >
          🔊
        </button>
      </div>

      <div className="options-list">
        {(q.options || []).map((opt, idx) => {
          let cls = "option-btn";
          if (chosen !== null) {
            if (idx === q.correct) cls += " correct";
            else if (idx === chosen) cls += " wrong";
          }
          return (
            <button key={idx} className={cls} onClick={() => handleAnswer(idx)}>
              {getOptionLabel(opt)}
            </button>
          );
        })}
      </div>

      {chosen !== null && (
        <div className={`explanation ${chosen === q.correct ? "good" : "bad"}`}>
          {chosen === q.correct
            ? <p>🎉 {lang === "kz" ? q.explanation?.kz : q.explanation?.ru}</p>
            : <p>❌ {t("Дұрыс емес. Тағы бір рет!", "Неверно. Попробуй ещё!")}</p>
          }
          <button className="next-btn" onClick={handleNext}>
            {current + 1 < questions.length
              ? t("🔄 Келесі", "🔄 Следующий")
              : t("🏆 Нәтиже", "🏆 Результат")}
          </button>
        </div>
      )}
    </div>
  );
}
