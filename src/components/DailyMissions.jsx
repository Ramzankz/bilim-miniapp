import { useState, useEffect } from "react";
import { getDailyMissions } from "../data/gamification";

export default function DailyMissions({ lang, onBack, onAddCoins, onAddXP }) {
  const todayStr = new Date().toDateString();
  const storageKey = "bilim_missions_" + todayStr;

  const [missions] = useState(() => getDailyMissions(todayStr));
  const [progress, setProgress] = useState(() => {
    try { return JSON.parse(localStorage.getItem(storageKey) || "{}"); }
    catch { return {}; }
  });
  const [claimed, setClaimed] = useState(() => {
    try { return JSON.parse(localStorage.getItem(storageKey + "_claimed") || "[]"); }
    catch { return []; }
  });
  const [celebrateId, setCelebrateId] = useState(null);

  const getMissionProgress = (m) => {
    const val = progress[m.stat] || 0;
    return Math.min(val, m.target);
  };

  const isComplete = (m) => getMissionProgress(m) >= m.target;
  const isClaimed = (m) => claimed.includes(m.id);

  const claimReward = (m) => {
    if (!isComplete(m) || isClaimed(m)) return;
    const next = [...claimed, m.id];
    setClaimed(next);
    localStorage.setItem(storageKey + "_claimed", JSON.stringify(next));
    onAddCoins(m.coins);
    onAddXP(m.xp);
    setCelebrateId(m.id);
    setTimeout(() => setCelebrateId(null), 1500);

    // Track total missions completed
    const total = parseInt(localStorage.getItem("bilim_missions_total") || "0") + 1;
    localStorage.setItem("bilim_missions_total", total);
  };

  const allDone = missions.every(m => isClaimed(m));
  const doneCount = missions.filter(m => isClaimed(m)).length;

  return (
    <div className="missions-screen">
      <button className="back-btn" onClick={onBack}>← {lang === "kz" ? "Артқа" : "Назад"}</button>

      <div className="missions-header">
        <h2 className="missions-title">
          📋 {lang === "kz" ? "Күнделікті тапсырмалар" : "Ежедневные задания"}
        </h2>
        <p className="missions-date">{new Date().toLocaleDateString(lang === "kz" ? "kk-KZ" : "ru-RU", { day: "numeric", month: "long" })}</p>
        <div className="missions-progress-overall">
          <span>{doneCount}/{missions.length}</span>
          <div className="missions-overall-bar">
            <div className="missions-overall-fill" style={{ width: (doneCount/missions.length*100) + "%" }} />
          </div>
        </div>
      </div>

      {allDone && (
        <div className="missions-all-done">
          🎉 {lang === "kz" ? "Барлық тапсырма орындалды!" : "Все задания выполнены!"}
        </div>
      )}

      <div className="missions-list">
        {missions.map(m => {
          const prog = getMissionProgress(m);
          const done = isComplete(m);
          const cl = isClaimed(m);
          const celebrate = celebrateId === m.id;
          return (
            <div key={m.id} className={`mission-card ${cl ? "mission-claimed" : done ? "mission-done" : ""} ${celebrate ? "mission-celebrate" : ""}`}>
              <span className="mission-emoji">{m.emoji}</span>
              <div className="mission-info">
                <div className="mission-name">{lang === "kz" ? m.kz : m.ru}</div>
                <div className="mission-bar-wrap">
                  <div className="mission-bar-bg">
                    <div className="mission-bar-fill" style={{ width: (prog/m.target*100) + "%" }} />
                  </div>
                  <span className="mission-prog">{prog}/{m.target}</span>
                </div>
              </div>
              <div className="mission-reward">
                <div className="mission-rewards-text">+{m.xp}XP +{m.coins}🪙</div>
                {cl ? (
                  <span className="mission-check">✅</span>
                ) : done ? (
                  <button className="mission-claim-btn" onClick={() => claimReward(m)}>
                    {lang === "kz" ? "Алу" : "Взять"}
                  </button>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      <div className="missions-hint">
        💡 {lang === "kz"
          ? "Тапсырмалар сабақ, ойын немесе жұмбақ арқылы орындалады"
          : "Задания выполняются через уроки, игры и загадки"}
      </div>
    </div>
  );
}
