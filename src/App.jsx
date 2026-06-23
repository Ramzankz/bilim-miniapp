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

function Onboarding({ onDone }) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [lang, setLang] = useState("kz");
  const s = {
    wrap: { display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"100vh",padding:"24px",background:"linear-gradient(135deg,#f0eeff,#e8f5e9)",textAlign:"center",gap:"20px" },
    title: { fontSize:"2.4rem",fontWeight:900,color:"#6C5CE7",margin:0 },
    sub: { fontSize:"1rem",color:"#636e72",margin:0 },
    input: { border:"2px solid #6C5CE7",borderRadius:"14px",padding:"12px 18px",fontSize:"1.1rem",fontFamily:"inherit",outline:"none",width:"100%",maxWidth:"280px",textAlign:"center" },
    btn: (active) => ({ background:active?"#6C5CE7":"white",color:active?"white":"#6C5CE7",border:"2px solid #6C5CE7",borderRadius:"30px",padding:"14px 32px",fontSize:"1rem",fontWeight:800,cursor:"pointer",width:"100%",maxWidth:"280px" }),
    row: { display:"flex",gap:"12px",width:"100%",maxWidth:"280px" },
    langBtn: (active) => ({ flex:1,padding:"14px",borderRadius:"16px",border:"2px solid #6C5CE7",background:active?"#6C5CE7":"white",color:active?"white":"#6C5CE7",fontWeight:800,fontSize:"1rem",cursor:"pointer" }),
  };
  if (step === 0) return (
    <div style={s.wrap}>
      <div style={{fontSize:"4rem"}}>🎓</div>
      <h1 style={s.title}>Білім!</h1>
      <p style={s.sub}>Ойнай отырып үйрен · Учись играя</p>
      <div style={s.row}>
        <button style={s.langBtn(lang==="kz")} onClick={() => setLang("kz")}>ҚАЗ</button>
        <button style={s.langBtn(lang==="ru")} onClick={() => setLang("ru")}>РУС</button>
      </div>
      <button style={s.btn(true)} onClick={() => setStep(1)}>
        {lang === "kz" ? "Бастау! 🚀" : "Начать! 🚀"}
      </button>
    </div>
  );
  if (step === 1) return (
    <div style={s.wrap}>
      <div style={{fontSize:"3rem"}}>👤</div>
      <h2 style={{...s.title,fontSize:"1.6rem"}}>{lang === "kz" ? "Атыңды енгіз" : "Введи своё имя"}</h2>
      <input style={s.input} value={name} onChange={e => setName(e.target.value)}
        placeholder={lang === "kz" ? "Атың..." : "Твоё имя..."}
        maxLength={20} onKeyDown={e => e.key === "Enter" && name.trim() && setStep(2)} autoFocus />
      <button style={s.btn(!!name.trim())} onClick={() => name.trim() && setStep(2)}>
        {lang === "kz" ? "Келесі →" : "Далее →"}
      </button>
    </div>
  );
  return (
    <div style={s.wrap}>
      <div style={{fontSize:"3rem"}}>🌟</div>
      <h2 style={{...s.title,fontSize:"1.6rem"}}>{lang === "kz" ? "Дайынсың!" : "Готово!"}</h2>
      <p style={s.sub}>{lang === "kz" ? `Сәлем, ${name}! 👋` : `Привет, ${name}! 👋`}</p>
      <button style={s.btn(true)} onClick={() => {
        if (name.trim()) localStorage.setItem("bilim_name", name.trim());
        localStorage.setItem("bilim_lang", lang);
        onDone(name.trim(), lang);
      }}>
        {lang === "kz" ? "Ойнай бастайық! 🎮" : "Поехали! 🎮"}
      </button>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState("home");
  const [lang, setLang] = useState(() => localStorage.getItem("bilim_lang") || "kz");
  const [ageGroup, setAgeGroup] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [quizResult, setQuizResult] = useState(null);
  const [isPaid, setIsPaid] = useState(() => localStorage.getItem("bilim_paid") === "1");
  const [coins, setCoins] = useState(() => parseInt(localStorage.getItem("bilim_coins") || "20"));
  const [streak, setStreak] = useState(() => parseInt(localStorage.getItem("bilim_streak") || "0"));
  const [streakLost, setStreakLost] = useState(false);
  const [avatar, setAvatar] = useState(() => localStorage.getItem("bilim_avatar") || "a");
  const [xp, setXp] = useState(() => parseInt(localStorage.getItem("bilim_xp") || "0"));
  const [achievements, setAchievements] = useState(() => {
    try { return JSON.parse(localStorage.getItem("bilim_achievements") || "[]"); } catch { return []; }
  });
  const [onboardingDone, setOnboardingDone] = useState(
    () => localStorage.getItem("bilim_onboarded") === "1"
  );

  const t = (kz, ru) => lang === "kz" ? kz : ru;

  useEffect(() => {
    const today = new Date().toDateString();
    const last = localStorage.getItem("bilim_last_visit");
    if (last !== today) {
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      if (last && last !== yesterday && streak > 0) setStreakLost(true);
      const newStreak = last === yesterday ? streak + 1 : 1;
      setStreak(newStreak);
      localStorage.setItem("bilim_streak", newStreak);
      localStorage.setItem("bilim_last_visit", today);
    }
    const todayKey = "bilim_missions_" + today;
    const prog = JSON.parse(localStorage.getItem(todayKey) || "{}");
    if (!prog.loggedIn) { prog.loggedIn = 1; localStorage.setItem(todayKey, JSON.stringify(prog)); }
  }, []);

  const addCoins = (n) => setCoins(prev => {
    const next = prev + n; localStorage.setItem("bilim_coins", next); return next;
  });
  const addXP = (n) => setXp(prev => {
    const next = prev + n; localStorage.setItem("bilim_xp", next); return next;
  });

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

  const handleLessonSelect = (lesson) => {
    if (lesson.locked) { setScreen("paywall"); return; }
    if (!lesson.free && !isPaid) {
      setSelectedLesson(lesson);
      setScreen("paywall");
    } else {
      setSelectedLesson(lesson);
      setScreen("quiz");
    }
  };

  const handleQuizDone = (result) => {
    const earned = Math.round((result.score || 0) * 2);
    const xpEarned = Math.round((result.pct || 0) / 5) + 5;
    addCoins(earned);
    addXP(xpEarned);
    const quizCount = parseInt(localStorage.getItem("bilim_quiz_count") || "0") + 1;
    localStorage.setItem("bilim_quiz_count", quizCount);
    const isPerfect = result.pct === 100;
    const perfectCount = isPerfect
      ? parseInt(localStorage.getItem("bilim_perfect_count") || "0") + 1
      : parseInt(localStorage.getItem("bilim_perfect_count") || "0");
    if (isPerfect) localStorage.setItem("bilim_perfect_count", perfectCount);
    const stats = JSON.parse(localStorage.getItem("bilim_stats") || "[]");
    stats.push({
      ...result,
      coinsEarned: earned,
      xpEarned,
      date: new Date().toISOString(),
      lessonId: selectedLesson?.id,
      title: lang === "kz" ? selectedLesson?.title?.kz : selectedLesson?.title?.ru,
    });
    localStorage.setItem("bilim_stats", JSON.stringify(stats));
    updateMissionProgress("quizCount");
    if (isPerfect) updateMissionProgress("perfectCount");
    checkAchievements({ quizCount, perfectCount });
    setQuizResult({ ...result, coinsEarned: earned, xpEarned });
    setScreen("result");
  };

  const handlePaymentDone = () => {
    setIsPaid(true);
    localStorage.setItem("bilim_paid", "1");
    if (selectedLesson) setScreen("quiz");
    else setScreen("lessons");
  };

  const handleBuyAvatar = (newAvatar, price) => {
    if (price > 0 && coins < price) return false;
    if (price > 0) addCoins(-price);
    setAvatar(newAvatar);
    localStorage.setItem("bilim_avatar", newAvatar);
    const bought = JSON.parse(localStorage.getItem("bilim_bought") || "[]");
    if (!bought.includes(newAvatar)) {
      bought.push(newAvatar);
      localStorage.setItem("bilim_bought", JSON.stringify(bought));
    }
    checkAchievements({ boughtCount: bought.length });
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
    addCoins(coinAmount); addXP(20);
    const gamesWon = parseInt(localStorage.getItem("bilim_gamesWon") || "0") + 1;
    localStorage.setItem("bilim_gamesWon", gamesWon);
    checkAchievements({ gamesWon });
  };

  const stats = JSON.parse(localStorage.getItem("bilim_stats") || "[]");

  if (!onboardingDone) return (
    <div className="app-wrap">
      <Onboarding onDone={(name, selectedLang) => {
        if (name) localStorage.setItem("bilim_name", name);
        if (selectedLang) { localStorage.setItem("bilim_lang", selectedLang); setLang(selectedLang); }
        localStorage.setItem("bilim_onboarded", "1");
        setOnboardingDone(true);
      }} />
    </div>
  );

  const screenMap = {
    home: <Home lang={lang} t={t} onAgeSelect={(age) => { setAgeGroup(age); setScreen("lessons"); }}
      streak={streak} coins={coins} avatar={avatar} streakLost={streakLost}
      onShop={() => setScreen("shop")} onParent={() => setScreen("parent")}
      onRiddles={() => setScreen("riddles")} onGames={() => setScreen("games")}
      onProfile={() => setScreen("profile")} onMissions={() => setScreen("missions")}
      onLeaderboard={() => setScreen("leaderboard")} onElla={() => setScreen("ella")}
      xp={xp} achievements={achievements}
      onLangToggle={() => setLang(l => l === "kz" ? "ru" : "kz")} />,

    lessons: <LessonList lang={lang} t={t} ageGroup={ageGroup}
      onLessonSelect={handleLessonSelect} onBack={() => setScreen("home")} stats={stats} />,

    quiz: <QuizScreen lang={lang} t={t} lesson={selectedLesson} onDone={handleQuizDone}
      onBack={() => setScreen("lessons")} coins={coins} />,

    paywall: <Paywall lang={lang} t={t} onPaid={handlePaymentDone}
      onBack={() => setScreen(selectedLesson ? "lessons" : "home")} />,

    result: <Result lang={lang} t={t} result={quizResult} onRetry={() => setScreen("quiz")}
      onBack={() => setScreen("lessons")} />,

    shop: <Shop lang={lang} t={t} coins={coins} avatar={avatar} onBuy={handleBuyAvatar}
      onBack={() => setScreen("home")} />,

    parent: <ParentDashboard lang={lang} t={t} onBack={() => setScreen("home")} />,

    riddles: <Riddles lang={lang} coins={coins} onAddCoins={handleRiddleSolved}
      onBack={() => setScreen("home")} />,

    games: <MiniGames lang={lang} onBack={() => setScreen("home")} onWin={handleGameWin}
      onAddCoins={addCoins} onUpdateMission={updateMissionProgress} />,

    profile: <Profile lang={lang} t={t} onBack={() => setScreen("home")} xp={xp}
      coins={coins} streak={streak} avatar={avatar} achievements={achievements} />,

    missions: <DailyMissions lang={lang} onBack={() => setScreen("home")}
      onAddCoins={addCoins} onAddXP={addXP} />,

    leaderboard: <Leaderboard lang={lang} onBack={() => setScreen("home")} xp={xp} avatar={avatar} />,

    ella: <EllaAI lang={lang} onBack={() => setScreen("home")} />,
  };

  return <div className="app-wrap">{screenMap[screen] || screenMap.home}</div>;
}
