import { useState, useEffect, useCallback } from "react";

export default function QuizScreen({ lang, t, lesson, onDone, onBack, coins }) {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [chosen, setChosen] = useState(null);
  const [coinPop, setCoinPop] = useState(false);

  const questions = lesson?.questions || [];
  const q = questions[current];

  // Аудио: сұрақты дауыстап оқу
  const speak = useCallback((text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = lang === "kz" ? "ru-RU" : "ru-RU"; // Kazakh fallback to Russian TTS
    utt.rate = 0.85;
    utt.pitch = 1.1;
    window.speechSynthesis.speak(utt);
  }, [lang]);

  // Жаңа сұрақ келгенде автоматты оқу
  useEffect(() => {
    if (q) {
      const text = lang === "kz" ? q.text?.kz : q.text?.ru;
      if (text) speak(text);
    }
    return () => window.speechSynthesis?.cancel();
  }, [current, q, lang, speak]);

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
    if (current + 1 < questions.length) {
      setCurrent((c) => c + 1);
      setChosen(null);
    } else {
      window.speechSynthesis?.cancel();
      onDone({ score, total: questions.length });
    }
  };

  if (!q) return <div className="screen">{t("Сұрақтар жоқ", "Нет вопросов")}</div>;

  const questionText = lang === "kz" ? q.text?.kz : q.text?.ru;

  return (
    <div className="screen quiz-screen">
      <div className="quiz-header">
        <button className="back-btn" onClick={onBack}>✕</button>
        <span className="progress-label">{current + 1} / {questions.length}</span>
        <span className="quiz-coins">🪙 {coins}</span>
      </div>

      {coinPop && <div className="coin-popup">+10 🪙</div>}

      <div className="question-card">
        <p className="question-text">{questionText}</p>
        <button
          className="speak-btn"
          onClick={() => speak(questionText)}
          title={t("Дауыстап оқу", "Прочитать вслух")}
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
