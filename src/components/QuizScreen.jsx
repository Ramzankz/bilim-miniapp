import { useState, useRef, useEffect } from "react";

function speakWeb(text, lang) {
  if (!window.speechSynthesis) return null;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  const voices = window.speechSynthesis.getVoices();
  const langCode = lang === "kz" ? "kk" : "ru";
  const voice = voices.find(v => v.lang.startsWith(langCode))
    || voices.find(v => v.lang.startsWith("ru"))
    || null;
  if (voice) utter.voice = voice;
  utter.lang = lang === "kz" ? "kk-KZ" : "ru-RU";
  utter.rate = 0.85;
  window.speechSynthesis.speak(utter);
  return utter;
}

export default function QuizScreen({ lang, t, lesson, onDone, onBack, coins }) {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [chosen, setChosen] = useState(null);
  const [coinPop, setCoinPop] = useState(false);
  const [coinAmount, setCoinAmount] = useState(2);
  const [speaking, setSpeaking] = useState(false);
  const [showConfirmBack, setShowConfirmBack] = useState(false);
  const utterRef = useRef(null);

  const questions = lesson?.questions || [];
  const q = questions[current];
  const tFn = t || ((kz, ru) => lang === "kz" ? kz : ru);

  useEffect(() => {
    return () => { window.speechSynthesis?.cancel(); };
  }, []);

  const handleSpeak = (text) => {
    if (!text) return;
    if (speaking) {
      window.speechSynthesis?.cancel();
      setSpeaking(false);
      return;
    }
    setSpeaking(true);
    const utter = speakWeb(text, lang);
    if (utter) {
      utterRef.current = utter;
      utter.onend = () => setSpeaking(false);
      utter.onerror = () => setSpeaking(false);
    } else {
      setSpeaking(false);
    }
  };

  const handleStop = () => {
    window.speechSynthesis?.cancel();
    setSpeaking(false);
  };

  const handleAnswer = (idx) => {
    if (chosen !== null) return;
    handleStop();
    setChosen(idx);
    if (idx === q.correct) {
      const earned = 2;
      setScore(s => s + 1);
      setCoinAmount(earned);
      setCoinPop(true);
      setTimeout(() => setCoinPop(false), 1200);
    }
  };

  const handleNext = () => {
    handleStop();
    if (current + 1 < questions.length) {
      setCurrent(c => c + 1);
      setChosen(null);
    } else {
      onDone({
        score,
        total: questions.length,
        pct: Math.round((score / questions.length) * 100),
      });
    }
  };

  const handleBack = () => {
    handleStop();
    if (current > 0) {
      setShowConfirmBack(true);
    } else {
      onBack();
    }
  };

  const getOptionLabel = (opt) => {
    if (typeof opt === "string") return opt;
    return lang === "kz" ? opt.kz : opt.ru;
  };

  if (!q) return <div className="screen">{tFn("Сұрақтар жоқ", "Нет вопросов")}</div>;

  const questionText = lang === "kz" ? q.text?.kz : q.text?.ru;

  return (
    <div className="screen quiz-screen">
      {showConfirmBack && (
        <div className="confirm-overlay">
          <div className="confirm-box">
            <p>{tFn(
              "Тесттен шыға аласыз. Прогресс сақталмайды.",
              "Выйти из теста? Прогресс не сохранится."
            )}</p>
            <div className="confirm-btns">
              <button className="btn-cancel" onClick={() => setShowConfirmBack(false)}>
                {tFn("Жалғастыру", "Продолжить")}
              </button>
              <button className="btn-exit" onClick={() => { setShowConfirmBack(false); onBack(); }}>
                {tFn("Шығу", "Выйти")}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="quiz-header">
        <button className="back-btn" onClick={handleBack}>✕</button>
        <span className="progress-label">{current + 1} / {questions.length}</span>
        <span className="quiz-coins">🪙 {coins}</span>
      </div>

      {coinPop && <div className="coin-popup">+{coinAmount} 🪙</div>}

      <div className="question-card">
        <p className="question-text">{questionText}</p>
        <button
          className={`speak-btn ${speaking ? "speaking" : ""}`}
          onClick={() => handleSpeak(questionText)}
          aria-label="Дауыстап оқу"
        >
          {speaking ? "⏹️" : "🔊"}
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
            : <p>❌ {tFn("Дұрыс емес. Тағы бір рет!", "Неверно. Попробуй ещё!")}</p>
          }
          <button className="next-btn" onClick={handleNext}>
            {current + 1 < questions.length
              ? tFn("🔄 Келесі", "🔄 Следующий")
              : tFn("🏆 Нәтиже", "🏆 Результат")}
          </button>
        </div>
      )}
    </div>
  );
}
