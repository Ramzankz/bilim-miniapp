import { useState } from "react";
import { getLevel, FAKE_PLAYERS } from "../data/gamification";

export default function Leaderboard({ lang, onBack, xp, avatar }) {
  const AVATAR_EMOJI = { a: "🐱", b: "🐶", c: "🦊", d: "🐸", e: "🦄", f: "🐯" };
  const userAvatar = AVATAR_EMOJI[avatar] || "🐱";
  const userName = localStorage.getItem("bilim_name") || (lang === "kz" ? "Сен" : "Ты");

  // Insert real user into leaderboard
  const allPlayers = [...FAKE_PLAYERS, { name: userName, xp, avatar: userAvatar, city: "—", isMe: true }]
    .sort((a, b) => b.xp - a.xp);

  const myRank = allPlayers.findIndex(p => p.isMe) + 1;
  const myData = allPlayers.find(p => p.isMe);

  const medalFor = (rank) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return rank;
  };

  return (
    <div className="leaderboard-screen">
      <button className="back-btn" onClick={onBack}>← {lang === "kz" ? "Артқа" : "Назад"}</button>

      <div className="lb-header">
        <h2 className="lb-title">🏆 {lang === "kz" ? "Рейтинг" : "Рейтинг"}</h2>
        <p className="lb-subtitle">{lang === "kz" ? "Апталық нәтижелер" : "Результаты недели"}</p>
      </div>

      <div className="lb-myrank-card">
        <span className="lb-myrank-num">#{myRank}</span>
        <span className="lb-myrank-avatar">{userAvatar}</span>
        <div>
          <div className="lb-myrank-name">{lang === "kz" ? "Сенің орның" : "Твоё место"}</div>
          <div className="lb-myrank-xp">{xp} XP · {getLevel(xp).emoji} {lang === "kz" ? getLevel(xp).titleKz : getLevel(xp).titleRu}</div>
        </div>
      </div>

      <div className="lb-list">
        {allPlayers.map((p, i) => {
          const rank = i + 1;
          const isMe = p.isMe;
          return (
            <div key={i} className={`lb-row ${isMe ? "lb-row-me" : ""} ${rank <= 3 ? "lb-row-top" : ""}`}>
              <span className="lb-rank">{medalFor(rank)}</span>
              <span className="lb-avatar">{p.avatar}</span>
              <div className="lb-info">
                <span className="lb-name">{p.name} {isMe && "👈"}</span>
                <span className="lb-city">{p.city}</span>
              </div>
              <div className="lb-xp-wrap">
                <span className="lb-xp">{p.xp} XP</span>
                <span className="lb-lvl">{getLevel(p.xp).emoji}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="lb-note">
        💡 {lang === "kz"
          ? "XP жинау үшін тест өтіп, жұмбақ шешіп, ойын ойна!"
          : "Зарабатывай XP через тесты, загадки и игры!"}
      </div>

      <p className="lb-disclaimer">
        {lang === "kz"
          ? "ℹ️ Рейтинг Білім қолданушыларының ортасынан"
          : "ℹ️ Рейтинг среди пользователей Білім"}
      </p>
    </div>
  );
}
