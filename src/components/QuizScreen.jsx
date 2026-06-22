import { useState, useRef } from "react";

function speakText(text, lang) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = lang === "kz" ? "kk-KZ" : "ru-RU";
  utter.rate = 0.9;
  window.speechSynthesis.speak(utter);
}

function stopSpeech() {
  if (window.speechSynthesis) window.speechSynthesis.cancel();
}

export default function QuizScreen({ lang, t, lesson, onDone, onBack, coins }) {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [chosen, setChosen] = useState(null);
  const [coinPop, setCoinPop] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  const questions = lesson?.questions || [];
  const q = questions[current];

  const getOptionLabel = (opt) => {
    if (typeof opt === "string") return opt;
    return lang === "kz" ? opt.kz : opt.ru;
  };

  const handleSpeak = (text) => {
    if (!text) return;
    if (speaking) {
      stopSpeech();
      setSpeaking(false);
      return;
    }
    setSpeaking(true);
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = lang === "kz" ? "kk-KZ" : "ru-RU";
      utter.rate = 0.9;
      utter.onend = () => setSpeaking(false);
      utter.onerror = () => setSpeaking(false);
      window.speechSynthesis.speak(utter);
    } else {
      setSpeaking(false);
    }
  };

  const handleStop = () => {
    stopSpeech();
    setSpeaking(false);
  };

  const handleAnswer = (idx) => {
    if (chosen !== null) return;
    handleStop();
    setChosen(idx);
    if (idx === q.correct) {
      setScore((s) => s + 1);
      setCoinPop(true);
      setTimeout(() => setCoinPop(false), 1200);
    }
  };

  const handleNext = () => {
    handleStop();
    if (current + 1 < questions.length) {
      setCurrent((c) => c + 1);
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
    onBack();
  };

  const tFn = t || ((kz, ru) => lang === "kz" ? kz : ru);

  if (!q) return <div className="screen">{tFn("Сұрақтар жоқ", "Нет вопросов")}</div>;

  const questionText = lang === "kz" ? q.text?.kz : q.text?.ru;

  return (
    <div className="screen quiz-screen">
      <div className="quiz-header">
        <button className="back-btn" onClick={handleBack}>✕</button>
        <span className="progress-label">{current + 1} / {questions.length}</span>
        <span className="quiz-coins">🪙 {coins}</span>
      </div>

      {coinPop && <div className="coin-popup">+10 🪙</div>}

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
