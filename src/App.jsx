import { useState, useEffect } from "react";
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
import "./index.css";

// Safe JSON parse — never throws
function safeJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

const T = {
  kz: { selectAge: "Жасыңды таңда", hello: "Сәлем! 👋", back: "Артқа" },
  ru: { selectAge: "Выбери возраст", hello: "Привет! 👋", back: "Назад" },
};

export default function App() {
  const [screen, setScreen] = useState("home");
  const [lang, setLang] = useState("kz");
  const [ageGroup, setAgeGroup] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [quizResult, setQuizResult] = useState(null);
  const [isPaid, setIsPaid] = useState(() => localStorage.getItem("bilim_paid") === "1");
  const [coins, setCoins] = useState(() => parseInt(localStorage.getItem("bilim_coins") || "20"));
  const [streak, setStreak] = useState(() => parseInt(localStorage.getItem("bilim_streak") || "0"));
  const [avatar, setAvatar] = useState(() => localStorage.getItem("bilim_avatar") || "a");
  const [xp, setXp] = useState(() => parseInt(localStorage.getItem("bilim_xp") || "0"));
  const [achievements, setAchievements] = useState(() => safeJSON("bilim_achievements", []));

  useEffect(() => {
    try {
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
      const prog = safeJSON(todayKey, {});
      if (!prog.loggedIn) {
        prog.loggedIn = 1;
        localStorage.setItem(todayKey, JSON.stringify(prog));
      }
    } catch (e) {
      console.error("init error:", e);
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
    try {
      const state = {
        quizCount: parseInt(localStorage.getItem("bilim_quiz_count") || "0"),
        perfectCount: parseInt(localStorage.getItem("bilim_perfect_count") || "0"),
        streak: parseInt(localStorage.getItem("bilim_streak") || "0"),
        coins: parseInt(localStorage.getItem("bilim_coins") || "0"),
        xp: parseInt(localStorage.getItem("bilim_xp") || "0"),
        boughtCount: safeJSON("bilim_bought", []).length,
        riddlesSolved: parseInt(localStorage.getItem("bilim_riddles_solved") || "0"),
        gamesWon: parseInt(localStorage.getItem("bilim_gamesWon") || "0"),
        missionsCompleted: parseInt(localStorage.getItem("bilim_missions_total") || "0"),
        ...extra,
      };
      const current = safeJSON("bilim_achievements", []);
      const newOnes = ACHIEVEMENTS.filter(a => !current.includes(a.id) && a.check(state)).map(a => a.id);
      if (newOnes.length) {
        const updated = [...current, ...newOnes];
        localStorage.setItem("bilim_achievements", JSON.stringify(updated));
        setAchievements(updated);
      }
    } catch (e) {
      console.error("achievements error:", e);
    }
  };

  const updateMissionProgress = (stat, amount = 1) => {
    try {
      const today = new Date().toDateString();
      const key = "bilim_missions_" + today;
      const prog = safeJSON(key, {});
      prog[stat] = (prog[stat] || 0) + amount;
      localStorage.setItem(key, JSON.stringify(prog));
    } catch (e) {}
  };

  const handleAgeSelect = (age) => { setAgeGroup(age); setScreen("lessons"); };

  const handleLessonSelect = (lesson) => {
    setSelectedLesson(lesson);
    setScreen(!lesson.free && !isPaid ? "paywall" : "quiz");
  };

  const handleQuizDone = (result) => {
    try {
      setQuizResult(result);
      addCoins(Math.round(result.score * 2));
      addXP(Math.round(result.pct / 5) + 5);
      const quizCount = parseInt(localStorage.getItem("bilim_quiz_count") || "0") + 1;
      localStorage.setItem("bilim_quiz_count", quizCount);
      if (result.pct === 100) {
        const pc = parseInt(localStorage.getItem("bilim_perfect_count") || "0") + 1;
        localStorage.setItem("bilim_perfect_count", pc);
      }
      const stats = safeJSON("bilim_stats", []);
      stats.push({ ...result, date: new Date().toISOString(), lesson: selectedLesson?.title?.kz });
      localStorage.setItem("bilim_stats", JSON.stringify(stats));
      updateMissionProgress("quizCount");
      if (result.pct === 100) updateMissionProgress("perfectCount");
      checkAchievements({ quizCount });
    } catch (e) { console.error("quiz done error:", e); }
    setScreen("result");
  };

  const handlePaymentDone = () => { setIsPaid(true); localStorage.setItem("bilim_paid","1"); setScreen("quiz"); };

  const handleBuyAvatar = (newAvatar, price) => {
    if (coins < price) return false;
    addCoins(-price); setAvatar(newAvatar); localStorage.setItem("bilim_avatar", newAvatar);
    checkAchievements({ boughtCount: safeJSON("bilim_bought", []).length });
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

  const t = T[lang];

  const renderScreen = () => {
    try {
      switch (screen) {
        case "lessons":
          return <LessonList lang={lang} t={t} ageGroup={ageGroup} onSelect={handleLessonSelect} isPaid={isPaid} onBack={() => setScreen("home")} />;
        case "quiz":
          return <QuizScreen lang={lang} lesson={selectedLesson} onDone={handleQuizDone} onBack={() => setScreen("lessons")} />;
        case "paywall":
          return <Paywall lang={lang} t={t} lesson={selectedLesson} onPay={handlePaymentDone} onBack={() => setScreen("lessons")} />;
        case "result":
          return <Result lang={lang} t={t} result={quizResult} onRetry={() => setScreen("quiz")} onBack={() => setScreen("lessons")} />;
        case "shop":
          return <Shop lang={lang} t={t} coins={coins} avatar={avatar} onBuy={handleBuyAvatar} onBack={() => setScreen("home")} />;
        case "parent":
          return <ParentDashboard lang={lang} t={t} onBack={() => setScreen("home")} />;
        case "riddles":
          return <Riddles lang={lang} coins={coins} onAddCoins={handleRiddleSolved} onBack={() => setScreen("home")} />;
        case "games":
          return <MiniGames lang={lang} onBack={() => setScreen("home")} onWin={handleGameWin} onAddCoins={addCoins} onUpdateMission={updateMissionProgress} />;
        case "profile":
          return <Profile lang={lang} t={t} onBack={() => setScreen("home")} xp={xp} coins={coins} streak={streak} avatar={avatar} achievements={achievements} />;
        case "missions":
          return <DailyMissions lang={lang} onBack={() => setScreen("home")} onAddCoins={addCoins} onAddXP={addXP} />;
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
    } catch (e) {
      console.error("render error:", e);
      return (
        <div style={{padding:20,textAlign:"center"}}>
          <p>⚠️ Қате: {e.message}</p>
          <button onClick={() => setScreen("home")} style={{padding:"10px 20px",marginTop:10,borderRadius:12,background:"#6c63ff",color:"white",border:"none",fontSize:16}}>
            🏠 Басына қайт
          </button>
        </div>
      );
    }
  };

  return <div className="app-wrap">{renderScreen()}</div>;
}
