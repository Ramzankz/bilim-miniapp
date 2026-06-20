import { useState, useEffect, useCallback } from "react";

function genQ(level) {
  const max = 5 + level * 5;
  const ops = level < 2 ? ["+","-"] : ["+","-","×"];
  const op = ops[Math.floor(Math.random() * ops.length)];
  let a = Math.floor(Math.random() * max) + 1;
  let b = Math.floor(Math.random() * max) + 1;
  if (op === "-" && b > a) [a, b] = [b, a];
  const correct = op === "+" ? a + b : op === "-" ? a - b : a * b;
  const wrongs = new Set();
  while (wrongs.size < 3) {
    const w = correct + (Math.floor(Math.random() * 7) - 3);
    if (w !== correct && w >= 0) wrongs.add(w);
  }
  const opts = [...wrongs, correct].sort(() => Math.random() - 0.5);
  return { text: `${a} ${op} ${b} = ?`, correct, opts };
}

const TIME_PER_Q = 8;
const TOTAL_Q = 10;

export default function QuickMath({ lang, t, onBack, onEarn }) {
  const [phase, setPhase] = useState("start"); // start | play | done
  const [level, setLevel] = useState(0);
  const [qIdx, setQIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [q, setQ] = useState(null);
  const [timer, setTimer] = useState(TIME_PER_Q);
  const [chosen, setChosen] = useState(null);
  const [streak, setStreak] = useState(0);

  const nextQ = useCallback((sc, lv, idx) => {
    if (idx >= TOTAL_Q) { setPhase("done"); onEarn(sc * 3); return; }
    setQ(genQ(lv));
    setTimer(TIME_PER_Q);
    setChosen(null);
  }, [onEarn]);

  useEffect(() => {
    if (phase !== "play") return;
    const iv = setInterval(() => {
      setTimer(t => {
        if (t <= 1) {
          setChosen("timeout");
          setStreak(0);
          setTimeout(() => {
            setQIdx(i => { nextQ(score, level, i + 1); return i + 1; });
          }, 600);
          return TIME_PER_Q;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(iv);
  }, [phase, score, level, nextQ]);

  const handleAnswer = (opt) => {
    if (chosen !== null) return;
    setChosen(opt);
    const correct = opt === q.correct;
    const ns = correct ? streak + 1 : 0;
    setStreak(ns);
    if (correct) {
      const bonus = ns >= 3 ? 2 : 1;
      setScore(s => s + bonus);
      setLevel(l => Math.min(l + 1, 5));
    }
    setTimeout(() => {
      setQIdx(i => { nextQ(score + (correct ? 1 : 0), level, i + 1); return i + 1; });
    }, 700);
  };

  const start = () => {
    setPhase("play"); setQIdx(0); setScore(0); setLevel(0); setStreak(0);
    setQ(genQ(0)); setTimer(TIME_PER_Q); setChosen(null);
  };

  if (phase === "start") return (
    <div className="screen game-screen center">
      <div className="game-header"><button className="back-btn" onClick={onBack}>✕</button><h2>{t("⚡ Жылдам санау","⚡ Быстрый счёт")}</h2><span /></div>
      <div className="qm-intro">
        <div className="win-icon">🧮</div>
        <h3>{t("Ережелер:","Правила:")}</h3>
        <p>{t(`${TOTAL_Q} сұрақ, ${TIME_PER_Q} секунд`,`${TOTAL_Q} вопросов, ${TIME_PER_Q} секунд`)}</p>
        <p>{t("Қатар дұрыс жауапта x2 бонус!","Серия правильных = x2 бонус!")}</p>
        <button className="solve-btn" onClick={start}>{t("🚀 Бастау!","Старт!")}</button>
      </div>
    </div>
  );

  if (phase === "done") return (
    <div className="screen game-screen center">
      <div className="game-header"><button className="back-btn" onClick={onBack}>✕</button><h2>{t("Нәтиже","Результат")}</h2><span /></div>
      <div className="win-screen">
        <div className="win-icon">{score >= 8 ? "🥇" : score >= 5 ? "🥈" : "💪"}</div>
        <h2>{score >= 8 ? t("Ғажап!","Отлично!") : score >= 5 ? t("Жақсы!","Хорошо!") : t("Жалғастыр!","Продолжай!")}</h2>
        <p className="qm-score">{score} / {TOTAL_Q}</p>
        <p>{t(`+${score * 3} тиын жиналды!`, `+${score * 3} монет!`)}</p>
        <button className="solve-btn" onClick={start}>{t("🔄 Қайта","Снова")}</button>
      </div>
    </div>
  );

  const pct = (timer / TIME_PER_Q) * 100;
  return (
    <div className="screen game-screen">
      <div className="game-header">
        <button className="back-btn" onClick={onBack}>✕</button>
        <h2>{t("⚡ Жылдам санау","⚡ Быстрый счёт")}</h2>
        <span className="game-stat">{qIdx + 1}/{TOTAL_Q} | 🏆{score}</span>
      </div>
      <div className="qm-timer-bar"><div className="qm-timer-fill" style={{width: pct+"%", background: pct < 30 ? "#e17055" : "#00b894"}} /></div>
      <div className="qm-timer-num">{timer}с</div>
      {streak >= 3 && <div className="streak-banner">🔥 {streak} {t("қатар дұрыс! x2","подряд! x2")}</div>}
      <div className="question-card" style={{marginTop:12}}>
        <p className="question-text" style={{fontSize:32}}>{q?.text}</p>
      </div>
      <div className="options-list" style={{marginTop:12}}>
        {q?.opts.map((opt, i) => {
          let cls = "option-btn";
          if (chosen !== null) {
            if (opt === q.correct) cls += " correct";
            else if (opt === chosen) cls += " wrong";
          }
          return <button key={i} className={cls} onClick={() => handleAnswer(opt)}>{opt}</button>;
        })}
      </div>
    </div>
  );
}
