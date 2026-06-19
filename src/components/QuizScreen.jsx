import { useState } from "react";

export default function QuizScreen({ lang, t, lesson, onDone, onBack, coins }) {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [chosen, setChosen] = useState(null);
  const [coinPop, setCoinPop] = useState(false);

  const questions = lesson?.questions || [];
  const q = questions[current];

  // Деректер форматы: q.text.kz, q.correct, q.explanation.kz
  // Options: string немесе {kz, ru} болуы мүмкін
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
      onDone({ score, total: questions.length });
    }
  };

  if (!q) return <div className="screen">{t("Сұрақтар жоқ", "Нет вопросов")}</div>;

  return (
    <div className="screen quiz-screen">
      <div className="quiz-header">
        <button className="back-btn" onClick={onBack}>✕</button>
        <span className="quiz-progress">{current + 1} / {questions.length}</span>
        <span className="quiz-coins">🪙 {coins}</span>
      </div>

      {coinPop && <div className="coin-popup">+10 🪙</div>}

      <div className="question-card">
        <p className="question-text">
          {lang === "kz" ? q.text?.kz : q.text?.ru}
        </p>
      </div>

      <div className="answers">
        {(q.options || []).map((opt, idx) => {
          let cls = "answer-btn";
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
        <div className="explanation">
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
