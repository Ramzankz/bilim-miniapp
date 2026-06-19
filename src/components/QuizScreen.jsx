import { useState, useRef } from "react";

// Google Translate TTS — нақты қазақ дыбысы
function speakGT(text, lang) {
  const tl = lang === "kz" ? "kk" : "ru";
  const url =
    "https://translate.google.com/translate_tts" +
    "?ie=UTF-8&client=tw-ob&tl=" + tl +
    "&q=" + encodeURIComponent(text);
  return url;
}

export default function QuizScreen({ lang, t, lesson, onDone, onBack, coins }) {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [chosen, setChosen] = useState(null);
  const [coinPop, setCoinPop] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const audioRef = useRef(null);

  const questions = lesson?.questions || [];
  const q = questions[current];

  const getOptionLabel = (opt) => {
    if (typeof opt === "string") return opt;
    return lang === "kz" ? opt.kz : opt.ru;
  };

  const handleSpeak = (text) => {
    if (!text) return;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }
    const audio = new Audio(speakGT(text, lang));
    audioRef.current = audio;
    setSpeaking(true);
    audio.onended = () => setSpeaking(false);
    audio.onerror = () => setSpeaking(false);
    audio.play().catch(() => setSpeaking(false));
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }
    setSpeaking(false);
  };

  const handleAnswer = (idx) => {
    if (chosen !== null) return;
    stopAudio();
    setChosen(idx);
    if (idx === q.correct) {
      setScore((s) => s + 1);
      setCoinPop(true);
      setTimeout(() => setCoinPop(false), 1200);
    }
  };

  const handleNext = () => {
    stopAudio();
    if (current + 1 < questions.length) {
      setCurrent((c) => c + 1);
      setChosen(null);
    } else {
      onDone({ score, total: questions.length });
    }
  };

  const handleBack = () => {
    stopAudio();
    onBack();
  };

  if (!q) return <div className="screen">{t("Сұрақтар жоқ", "Нет вопросов")}</div>;

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
          onClick={() => speaking ? stopAudio() : handleSpeak(questionText)}
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
