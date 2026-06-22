import { useState } from "react";

function getStats() {
  try { return JSON.parse(localStorage.getItem("bilim_stats") || "[]"); } catch { return []; }
}

export default function ParentDashboard({ lang, t, onBack }) {
  const [pin, setPin] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [shake, setShake] = useState(false);

  const PARENT_PIN = localStorage.getItem("bilim_parent_pin") || "1234";

  const tFn = t || ((kz, ru) => lang === "kz" ? kz : ru);

  const coins  = parseInt(localStorage.getItem("bilim_coins")  || "0");
  const streak = parseInt(localStorage.getItem("bilim_streak") || "0");
  const stats  = getStats();

  const totalLessons = stats.length;
  const avgPct = totalLessons
    ? Math.round(stats.reduce((a, s) => a + ((s.pct ?? Math.round(((s.score||0)/(s.total||1))*100))), 0) / totalLessons)
    : 0;

  const topicMap = {};
  stats.forEach(s => {
    const key = s.title || s.lesson || "—";
    if (!topicMap[key]) topicMap[key] = { correct: 0, total: 0, count: 0 };
    topicMap[key].correct += s.score || 0;
    topicMap[key].total  += s.total || 1;
    topicMap[key].count  += 1;
  });
  const topics = Object.entries(topicMap)
    .map(([title, d]) => ({ title, pct: Math.round(d.correct / d.total * 100), count: d.count }))
    .sort((a, b) => a.pct - b.pct);

  const handleDigit = (d) => {
    const next = pin + d;
    setPin(next);
    if (next.length === 4) {
      if (next === PARENT_PIN) { setUnlocked(true); }
      else { setShake(true); setTimeout(() => { setPin(""); setShake(false); }, 700); }
    }
  };

  if (!unlocked) return (
    <div className="screen parent-screen">
      <button className="back-btn" onClick={onBack}>✕</button>
      <div className="pin-wrap">
        <div className="pin-icon">👨‍👩‍👧</div>
        <h2>{tFn("Ата-ана кабинеті", "Кабинет родителя")}</h2>
        <p className="pin-hint">{tFn("4 санды енгіз", "Введи 4 цифры")}</p>
        <div className={`pin-dots${shake ? " shake" : ""}`}>
          {[0,1,2,3].map(i => <span key={i} className={`pin-dot${i < pin.length ? " filled" : ""}`} />)}
        </div>
        <div className="pin-pad">
          {[1,2,3,4,5,6,7,8,9,null,0,"⌫"].map((d, i) => (
            <button key={i} className={`pin-key${d === null ? " empty" : ""}`}
              onClick={() => { if (d === "⌫") setPin(p => p.slice(0,-1)); else if (d !== null) handleDigit(String(d)); }}>
              {d}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="screen parent-screen">
      <div className="parent-header">
        <button className="back-btn" onClick={onBack}>✕</button>
        <h2>{tFn("📊 Статистика", "📊 Статистика")}</h2>
      </div>

      <div className="pstat-grid">
        {[
          { icon: "📚", val: totalLessons, label: tFn("Сабақ өтті","Уроков пройдено") },
          { icon: "🎯", val: avgPct+"%",   label: tFn("Орташа нәтиже","Средний балл") },
          { icon: "🪙", val: coins,         label: tFn("Тиын","Монет") },
          { icon: "🔥", val: streak,        label: tFn("Күн қатарынан","Дней подряд") },
        ].map((s,i) => (
          <div key={i} className="pstat-card">
            <span className="pstat-icon">{s.icon}</span>
            <span className="pstat-num">{s.val}</span>
            <span className="pstat-lbl">{s.label}</span>
          </div>
        ))}
      </div>

      {topics.length > 0 ? (
        <div className="topic-list">
          <h3>{tFn("Тақырыптар бойынша нәтиже:","Результаты по темам:")}</h3>
          {topics.map((tp, i) => (
            <div key={i} className="topic-row">
              <span className="topic-title">{tp.title}</span>
              <div className="topic-bar-wrap">
                <div className="topic-bar" style={{ width: tp.pct+"%" }} />
              </div>
              <span className={`topic-pct${tp.pct < 60 ? " red" : tp.pct < 80 ? " orange" : " green"}`}>{tp.pct}%</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-stats">
          <p>🧒 {tFn("Бала әлі сабақ өтпеген","Ребёнок ещё не проходил уроки")}</p>
        </div>
      )}
    </div>
  );
}
