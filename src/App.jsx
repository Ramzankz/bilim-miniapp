import React, { useState, useEffect } from "react";
import "./index.css";
import Home from "./components/Home";
import LessonList from "./components/LessonList";
import QuizScreen from "./components/QuizScreen";
import Paywall from "./components/Paywall";
import Result from "./components/Result";
import Shop from "./components/Shop";
import ParentDashboard from "./components/ParentDashboard";
import Riddles from "./components/Riddles";
import MiniGames from "./components/MiniGames";
import Profile from "./components/Profile";
import DailyMissions from "./components/DailyMissions";
import Leaderboard from "./components/Leaderboard";
import EllaAI from "./components/EllaAI";
import { ACHIEVEMENTS } from "./data/gamification";

// Error Boundary — prevents blank screen on any component crash
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error("Bilim app error:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "2rem", textAlign: "center", fontFamily: "sans-serif" }}>
          <div style={{ fontSize: "3rem" }}>⚠️</div>
          <p style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>
            Қате кетті. Беттi жаңарту керек.
          </p>
          <button
            onClick={() => { this.setState({ hasError: false }); }}
            style={{ padding: "0.7rem 1.5rem", borderRadius: "12px", border: "none",
              background: "#6c5ce7", color: "#fff", fontSize: "1rem", cursor: "pointer" }}
          >
            🔄 Қайта жүктеу
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [screen, setScreen] = useState("home");
  const [lang, setLang] = useState("kz");
  const [ageGroup, setAgeGroup] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [quizResult, setQuizResult] = useState(null);
  const [isPaid, setIsPaid] = useState(() => localStorage.getItem("bilim_paid") === "1");
  const [coins, setCoins] = useState(() => parseInt(localStorage.getItem("bilim_coins") || "20"));
  const [streak, setStreak] = useState(() => parseInt(localStorage.getItem("bilim_streak") || "0"));
  const [avatar, setAvatar] = useState(() => localStorage.getItem("bilim_avatar") || "lion");
  const [xp, setXp] = useState(() => parseInt(localStorage.getItem("bilim_xp") || "0"));
  const [achievements, setAchievements] = useState(() => {
    try { return JSON.parse(localStorage.getItem("bilim_achievements") || "[]"); } catch { return []; }
  });

  // t — translation function used by ALL components
  const t = (kz, ru) => lang === "kz" ? kz : ru;

  useEffect(() => {
    const today = new Date().toDateString();
    const last = localStorage.getItem("bilim_last_visit");
    if (last !== today) {
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      const newStreak = last === yesterday ? streak + 1 : 1;
      setStreak(newStreak);
      localStorage.setItem("bilim_streak", newStreak);
      localStorage.setItem("bilim_last_visit", today);
    }
    const todayKey = "bilim_missions_" + today;
    const prog = JSON.parse(localStorage.getItem(todayKey) || "{}");
    if (!prog.loggedIn) {
      prog.loggedIn = 1;
      localStorage.setItem(todayKey, JSON.stringify(prog));
    }
  }, []);

  const addCoins = (n) => {
    setCoins(prev => {
      const next = prev + n;
      localStorage.setItem("bilim_coins", next);
      return next;
    });
  };

  const addXP = (n) => {
    setXp(prev => {
      const next = prev + n;
      localStorage.setItem("bilim_xp", next);
      return next;
    });
  };

  const checkAchievements = (extra = {}) => {
    const state = {
      quizCount: parseInt(localStorage.getItem("bilim_quiz_count") || "0"),
      perfectCount: parseInt(localStorage.getItem("bilim_perfect_count") || "0"),
      streak: parseInt(localStorage.getItem("bilim_streak") || "0"),
      coins: parseInt(localStorage.getItem("bilim_coins") || "0"),
      xp: parseInt(localStorage.getItem("bilim_xp") || "0"),
      boughtCount: (JSON.parse(localStorage.getItem("bilim_bought") || "[]")).length,
      riddlesSolved: parseInt(localStorage.getItem("bilim_riddles_solved") || "0"),
      gamesWon: parseInt(localStorage.getItem("bilim_gamesWon") || "0"),
      missionsCompleted: parseInt(localStorage.getItem("bilim_missions_total") || "0"),
      ...extra,
    };
    const current = JSON.parse(localStorage.getItem("bilim_achievements") || "[]");
    const newOnes = ACHIEVEMENTS.filter(a => !current.includes(a.id) && a.check(state)).map(a => a.id);
    if (newOnes.length) {
      const updated = [...current, ...newOnes];
      localStorage.setItem("bilim_achievements", JSON.stringify(updated));
      setAchievements(updated);
    }
  };

  const updateMissionProgress = (stat, amount = 1) => {
    const today = new Date().toDateString();
    const key = "bilim_missions_" + today;
    const prog = JSON.parse(localStorage.getItem(key) || "{}");
    prog[stat] = (prog[stat] || 0) + amount;
    localStorage.setItem(key, JSON.stringify(prog));
  };

  const handleAgeSelect = (age) => { setAgeGroup(age); setScreen("lessons"); };

  const handleLessonSelect = (lesson) => {
    if (!lesson.free && !isPaid) { setSelectedLesson(lesson); setScreen("paywall"); }
    else { setSelectedLesson(lesson); setScreen("quiz"); }
  };

  const handleQuizDone = (result) => {
    setQuizResult(result);
    const earned = Math.round((result.score || 0) * 2);
    const xpEarned = Math.round((result.pct || 0) / 5) + 5;
    addCoins(earned);
    addXP(xpEarned);
    const quizCount = parseInt(localStorage.getItem("bilim_quiz_count") || "0") + 1;
    localStorage.setItem("bilim_quiz_count", quizCount);
    const prevPerfect = parseInt(localStorage.getItem("bilim_perfect_count") || "0");
    const perfectCount = result.pct === 100 ? prevPerfect + 1 : prevPerfect;
    if (result.pct === 100) localStorage.setItem("bilim_perfect_count", perfectCount);
    const stats = JSON.parse(localStorage.getItem("bilim_stats") || "[]");
    stats.push({ ...result, date: new Date().toISOString(), lesson: selectedLesson?.title?.kz });
    localStorage.setItem("bilim_stats", JSON.stringify(stats));
    updateMissionProgress("quizCount");
    if (result.pct === 100) updateMissionProgress("perfectCount");
    checkAchievements({ quizCount, perfectCount });
    setScreen("result");
  };

  const handlePaymentDone = () => {
    setIsPaid(true);
    localStorage.setItem("bilim_paid", "1");
    setScreen("quiz");
  };

  const handleBuyAvatar = (newAvatar, price) => {
    if (price > 0 && coins < price) return false;
    if (price > 0) addCoins(-price);
    setAvatar(newAvatar);
    localStorage.setItem("bilim_avatar", newAvatar);
    checkAchievements({ boughtCount: (JSON.parse(localStorage.getItem("bilim_bought") || "[]")).length });
    return true;
  };

  const handleRiddleSolved = () => {
    addCoins(10); addXP(15);
    updateMissionProgress("riddlesToday");
    const total = parseInt(localStorage.getItem("bilim_riddles_solved") || "0") + 1;
    localStorage.setItem("bilim_riddles_solved", total);
    checkAchievements({ riddlesSolved: total });
  };

  const handleGameWin = (coinAmount) => {
    addCoins(coinAmount || 20); addXP(20);
    const gamesWon = parseInt(localStorage.getItem("bilim_gamesWon") || "0") + 1;
    localStorage.setItem("bilim_gamesWon", gamesWon);
    checkAchievements({ gamesWon });
  };

  const renderScreen = () => {
    switch (screen) {
      case "lessons":
        return <LessonList lang={lang} t={t} ageGroup={ageGroup} onLessonSelect={handleLessonSelect}
          isPaid={isPaid} onBack={() => setScreen("home")} />;
      case "quiz":
        return <QuizScreen lang={lang} lesson={selectedLesson} onDone={handleQuizDone}
          onBack={() => setScreen("lessons")} />;
      case "paywall":
        return <Paywall lang={lang} t={t} lesson={selectedLesson} onPaid={handlePaymentDone}
          onBack={() => setScreen("lessons")} />;
      case "result":
        return <Result lang={lang} t={t} result={quizResult} lesson={selectedLesson}
          totalCoins={coins} onRetry={() => setScreen("quiz")} onBack={() => setScreen("lessons")} />;
      case "shop":
        return <Shop lang={lang} t={t} coins={coins} avatar={avatar} onBuy={handleBuyAvatar}
          onBack={() => setScreen("home")} />;
      case "parent":
        return <ParentDashboard lang={lang} t={t} onBack={() => setScreen("home")} />;
      case "riddles":
        return <Riddles lang={lang} t={t} onEarn={handleRiddleSolved} onBack={() => setScreen("home")} />;
      case "games":
        return <MiniGames lang={lang} onBack={() => setScreen("home")} onWin={handleGameWin}
          onAddCoins={addCoins} onUpdateMission={updateMissionProgress} />;
      case "profile":
        return <Profile lang={lang} t={t} onBack={() => setScreen("home")} xp={xp}
          coins={coins} streak={streak} avatar={avatar} achievements={achievements} />;
      case "missions":
        return <DailyMissions lang={lang} onBack={() => setScreen("home")}
          onAddCoins={addCoins} onAddXP={addXP} />;
      case "leaderboard":
        return <Leaderboard lang={lang} onBack={() => setScreen("home")} xp={xp} avatar={avatar} />;
      case "ella":
        return <EllaAI lang={lang} onBack={() => setScreen("home")} />;
      default:
        return (
          <Home lang={lang} t={t} onAgeSelect={handleAgeSelect} streak={streak} coins={coins}
            avatar={avatar} onShop={() => setScreen("shop")} onParent={() => setScreen("parent")}
            onRiddles={() => setScreen("riddles")} onGames={() => setScreen("games")}
            onProfile={() => setScreen("profile")} onMissions={() => setScreen("missions")}
            onLeaderboard={() => setScreen("leaderboard")} onElla={() => setScreen("ella")}
            xp={xp} achievements={achievements}
            onLangToggle={() => setLang(l => l === "kz" ? "ru" : "kz")} />
        );
    }
  };

  return (
    <div className="app-wrap">
      <ErrorBoundary key={screen}>
        {renderScreen()}
      </ErrorBoundary>
    </div>
  );
}
