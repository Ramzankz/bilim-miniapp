import { useState, useEffect } from "react";
import { getLevel, getNextLevel, getXpPercent, ACHIEVEMENTS } from "../data/gamification";

const AVATAR_EMOJI = { a: "🐱", b: "🐶", c: "🦊", d: "🐸", e: "🦄", f: "🐯" };

export default function Profile({ lang, t, onBack, xp, coins, streak, avatar, achievements }) {
  const [name, setName] = useState(() => localStorage.getItem("bilim_name") || "");
  const [editingName, setEditingName] = useState(!localStorage.getItem("bilim_name"));

  const level = getLevel(xp);
  const nextLevel = getNextLevel(xp);
  const pct = getXpPercent(xp);
  const earned = ACHIEVEMENTS.filter(a => achievements.includes(a.id));
  const locked = ACHIEVEMENTS.filter(a => !achievements.includes(a.id));

  const saveName = () => {
    if (name.trim()) {
      localStorage.setItem("bilim_name", name.trim());
      setEditingName(false);
    }
  };

  const stats = JSON.parse(localStorage.getItem("bilim_stats") || "[]");
  const totalLessons = stats.length;
  const avgScore = totalLessons
    ? Math.round(stats.reduce((s, r) => s + r.pct, 0) / totalLessons)
    : 0;

  return (
    <div className="profile-screen">
      <button className="back-btn" onClick={onBack}>← {lang === "kz" ? "Артқа" : "Назад"}</button>

      <div className="profile-card">
        <div className="profile-avatar">{AVATAR_EMOJI[avatar] || "🐱"}</div>

        {editingName ? (
          <div className="profile-name-edit">
            <input
              className="profile-name-input"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder={lang === "kz" ? "Атыңды енгіз..." : "Введи своё имя..."}
              maxLength={20}
              onKeyDown={e => e.key === "Enter" && saveName()}
              autoFocus
            />
            <button className="profile-save-btn" onClick={saveName}>✓</button>
          </div>
        ) : (
          <div className="profile-name-row">
            <span className="profile-name">{name}</span>
            <button className="profile-edit-btn" onClick={() => setEditingName(true)}>✏️</button>
          </div>
        )}

        <div className="profile-level-badge">
          <span className="level-emoji">{level.emoji}</span>
          <span className="level-title">{lang === "kz" ? level.titleKz : level.titleRu}</span>
          <span className="level-num">Дең. {level.level}</span>
        </div>

        <div className="xp-bar-wrap">
          <div className="xp-bar-label">
            <span>XP: {xp}</span>
            {nextLevel && <span>{lang === "kz" ? "Келесі" : "След."}: {nextLevel.min}</span>}
          </div>
          <div className="xp-bar-bg">
            <div className="xp-bar-fill" style={{ width: pct + "%" }} />
          </div>
          <div className="xp-pct">{pct}%</div>
        </div>
      </div>

      <div className="profile-stats-row">
        <div className="pstat-box">
          <span className="pstat-icon">📚</span>
          <span className="pstat-val">{totalLessons}</span>
          <span className="pstat-lbl">{lang === "kz" ? "Сабақ" : "Уроков"}</span>
        </div>
        <div className="pstat-box">
          <span className="pstat-icon">🎯</span>
          <span className="pstat-val">{avgScore}%</span>
          <span className="pstat-lbl">{lang === "kz" ? "Орт. балл" : "Ср. балл"}</span>
        </div>
        <div className="pstat-box">
          <span className="pstat-icon">🔥</span>
          <span className="pstat-val">{streak}</span>
          <span className="pstat-lbl">{lang === "kz" ? "Күн қатар" : "Дней подряд"}</span>
        </div>
        <div className="pstat-box">
          <span className="pstat-icon">🪙</span>
          <span className="pstat-val">{coins}</span>
          <span className="pstat-lbl">{lang === "kz" ? "Тиын" : "Монет"}</span>
        </div>
      </div>

      <div className="achievements-section">
        <h3 className="ach-title">
          🏅 {lang === "kz" ? "Жетістіктер" : "Достижения"} ({earned.length}/{ACHIEVEMENTS.length})
        </h3>
        <div className="ach-grid">
          {earned.map(a => (
            <div key={a.id} className="ach-badge earned" title={lang === "kz" ? a.kz : a.ru}>
              <span className="ach-emoji">{a.emoji}</span>
              <span className="ach-name">{lang === "kz" ? a.kz : a.ru}</span>
            </div>
          ))}
          {locked.map(a => (
            <div key={a.id} className="ach-badge locked" title={lang === "kz" ? a.kz : a.ru}>
              <span className="ach-emoji">🔒</span>
              <span className="ach-name">{lang === "kz" ? a.kz : a.ru}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
