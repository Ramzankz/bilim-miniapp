import React, { useState, useEffect } from "react";
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

// Inline Onboarding component
function Onboarding({ onDone }) {
  const [step, setStep] = React.useState(0);
  const [name, setName] = React.useState("");
  const [lang, setLang] = React.useState("kz");
  const t = (kz, ru) => lang === "kz" ? kz : ru;
  const next = () => {
    if (step < 2) { setStep(s => s + 1); }
    else { onDone(name.trim(), lang); }
  };
  if (step === 0) return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"100vh",background:"linear-gradient(135deg,#667eea,#764ba2)",padding:"20px"}}>
      <div style={{background:"white",borderRadius:"24px",padding:"32px",maxWidth:"360px",width:"100%",textAlign:"center",boxShadow:"0 20px 60px rgba(0,0,0,0.3)"}}>
        <div style={{fontSize:"64px",marginBottom:"16px"}}>🎓</div>
        <h1 style={{fontSize:"32px",fontWeight:"bold",color:"#333",margin:"0 0 12px"}}>Білім!</h1>
        <p style={{color:"#666",marginBottom:"24px"}}>{lang==="kz"?"Ойнай отырып білім ал!":"Учись играя!"}</p>
        <div style={{display:"flex",gap:"12px",marginBottom:"24px"}}>
          <button onClick={()=>setLang("kz")} style={{flex:1,padding:"12px",borderRadius:"12px",border:lang==="kz"?"2px solid #667eea":"2px solid #eee",background:lang==="kz"?"#f0f0ff":"white",cursor:"pointer",fontWeight:lang==="kz"?"bold":"normal"}}>🇰🇿 Қазақша</button>
          <button onClick={()=>setLang("ru")} style={{flex:1,padding:"12px",borderRadius:"12px",border:lang==="ru"?"2px solid #667eea":"2px solid #eee",background:lang==="ru"?"#f0f0ff":"white",cursor:"pointer",fontWeight:lang==="ru"?"bold":"normal"}}>🇷🇺 Русский</button>
        </div>
        <button onClick={next} style={{width:"100%",padding:"16px",borderRadius:"16px",background:"linear-gradient(135deg,#667eea,#764ba2)",color:"white",border:"none",fontSize:"18px",fontWeight:"bold",cursor:"pointer"}}>{lang==="kz"?"Бастау →":"Начать →"}</button>
      </div>
    </div>
  );
  if (step === 1) return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"100vh",background:"linear-gradient(135deg,#667eea,#764ba2)",padding:"20px"}}>
      <div style={{background:"white",borderRadius:"24px",padding:"32px",maxWidth:"360px",width:"100%",textAlign:"center",boxShadow:"0 20px 60px rgba(0,0,0,0.3)"}}>
        <div style={{fontSize:"64px",marginBottom:"16px"}}>👤</div>
        <h2 style={{fontSize:"24px",fontWeight:"bold",color:"#333",marginBottom:"8px"}}>{t("Атыңды жаз","Напиши своё имя")}</h2>
        <p style={{color:"#666",marginBottom:"20px"}}>{t("Мен сені атыңмен шақырамын!","Я буду называть тебя по имени!")}</p>
        <input type="text" value={name} onChange={e=>setName(e.target.value)} placeholder={t("Атың...","Твоё имя...")} maxLength={20} onKeyDown={e=>e.key==="Enter"&&name.trim()&&next()} autoFocus
          style={{width:"100%",padding:"14px",borderRadius:"12px",border:"2px solid #eee",fontSize:"16px",marginBottom:"16px",boxSizing:"border-box",outline:"none"}} />
        <button onClick={next} disabled={!name.trim()} style={{width:"100%",padding:"16px",borderRadius:"16px",background:name.trim()?"linear-gradient(135deg,#667eea,#764ba2)":"#ccc",color:"white",border:"none",fontSize:"18px",fontWeight:"bold",cursor:name.trim()?"pointer":"not-allowed",marginBottom:"8px"}}>{t("Келесі →","Далее →")}</button>
        <button onClick={next} style={{background:"none",border:"none",color:"#999",cursor:"pointer",fontSize:"14px"}}>{t("Өткізу","Пропустить")}</button>
      </div>
    </div>
  );
  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"100vh",background:"linear-gradient(135deg,#667eea,#764ba2)",padding:"20px"}}>
      <div style={{background:"white",borderRadius:"24px",padding:"32px",maxWidth:"360px",width:"100%",textAlign:"center",boxShadow:"0 20px 60px rgba(0,0,0,0.3)"}}>
        <div style={{fontSize:"64px",marginBottom:"16px"}}>🌐</div>
        <h2 style={{fontSize:"24px",fontWeight:"bold",color:"#333",marginBottom:"8px"}}>{t("Тіл таңда","Выбери язык")}</h2>
        <p style={{color:"#666",marginBottom:"20px"}}>{t("Кез-келген уақытта ауыстыруға болады","Можно изменить в любое время")}</p>
        <div style={{display:"flex",gap:"12px",marginBottom:"24px"}}>
          <button onClick={()=>setLang("kz")} style={{flex:1,padding:"16px",borderRadius:"16px",border:lang==="kz"?"3px solid #667eea":"2px solid #eee",background:lang==="kz"?"#f0f0ff":"white",cursor:"pointer"}}>🇰🇿<br/><span style={{fontWeight:"bold"}}>Қазақша</span>{lang==="kz"&&<span> ✓</span>}</button>
          <button onClick={()=>setLang("ru")} style={{flex:1,padding:"16px",borderRadius:"16px",border:lang==="ru"?"3px solid #667eea":"2px solid #eee",background:lang==="ru"?"#f0f0ff":"white",cursor:"pointer"}}>🇷🇺<br/><span style={{fontWeight:"bold"}}>Русский</span>{lang==="ru"&&<span> ✓</span>}</button>
        </div>
        <button onClick={next} style={{width:"100%",padding:"16px",borderRadius:"16px",background:"linear-gradient(135deg,#667eea,#764ba2)",color:"white",border:"none",fontSize:"18px",fontWeight:"bold",cursor:"pointer"}}>{t("Дайынмын! 🎓","Готово! 🎓")}</button>
      </div>
    </div>
  );
}

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  componentDidCatch(error, info) { console.error("ErrorBoundary:", error, info); }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{padding:"20px",textAlign:"center",color:"red"}}>
          <h2>Қате шықты 😕</h2>
          <p style={{fontSize:"12px",color:"#999"}}>{String(this.state.error)}</p>
          <button onClick={()=>this.setState({hasError:false,error:null})} style={{padding:"10px 20px",marginTop:"10px",borderRadius:"8px",border:"none",background:"#667eea",color:"white",cursor:"pointer"}}>🔄 Қайта жүктеу</button>
        </div>
      );
    }
    return this.props.children;
  }
}

const T = {
  kz: { selectAge: "Жасыңды таңда" },
  ru: { selectAge: "Выбери возраст" },
};

export default function App() {
  const [lang, setLang] = useState(() => localStorage.getItem("bilim_lang") || "kz");
  const [screen, setScreen] = useState("home");
  const [ageGroup, setAgeGroup] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [coins, setCoins] = useState(() => parseInt(localStorage.getItem("bilim_coins") || "0"));
  const [xp, setXp] = useState(() => parseInt(localStorage.getItem("bilim_xp") || "0"));
  const [streak, setStreak] = useState(() => parseInt(localStorage.getItem("bilim_streak") || "0"));
  const [streakLost, setStreakLost] = useState(false);
  const [avatar, setAvatar] = useState(() => localStorage.getItem("bilim_avatar") || "a");
  const [isPaid, setIsPaid] = useState(() => localStorage.getItem("bilim_paid") === "1");
  const [stats, setStats] = useState(() => JSON.parse(localStorage.getItem("bilim_stats") || "[]"));
  const [achievements, setAchievements] = useState(() => JSON.parse(localStorage.getItem("bilim_achievements") || "[]"));
  const [quizResult, setQuizResult] = useState(null);
  const [onboardingDone, setOnboardingDone] = useState(() => localStorage.getItem("bilim_onboarded") === "1");

  const t = (kz, ru) => lang === "kz" ? kz : ru;

  useEffect(() => {
    const today = new Date().toDateString();
    const last = localStorage.getItem("bilim_last_visit");
    if (last !== today) {
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      const currentStreak = parseInt(localStorage.getItem("bilim_streak") || "0");
      if (last && last !== yesterday && currentStreak > 0) setStreakLost(true);
      const newStreak = last === yesterday ? currentStreak + 1 : 1;
      setStreak(newStreak);
      localStorage.setItem("bilim_streak", newStreak);
      localStorage.setItem("bilim_last_visit", today);
    }
  }, []);

  const addCoins = (amount) => {
    setCoins(c => {
      const next = Math.max(0, c + amount);
      localStorage.setItem("bilim_coins", next);
      return next;
    });
  };

  const addXp = (amount) => {
    setXp(x => {
      const next = x + amount;
      localStorage.setItem("bilim_xp", next);
      return next;
    });
  };

  const checkAchievements = (context = {}) => {
    const current = JSON.parse(localStorage.getItem("bilim_achievements") || "[]");
    const newAchs = [];
    ACHIEVEMENTS.forEach(ach => {
      if (!current.includes(ach.id) && ach.check({ stats, coins, streak, boughtCount: context.boughtCount || 0 })) {
        newAchs.push(ach.id);
      }
    });
    if (newAchs.length > 0) {
      const updated = [...current, ...newAchs];
      setAchievements(updated);
      localStorage.setItem("bilim_achievements", JSON.stringify(updated));
    }
  };

  const handleLessonSelect = (lesson) => {
    if (lesson.locked) { setScreen("paywall"); return; }
    if (!lesson.free && !isPaid) { setSelectedLesson(lesson); setScreen("paywall"); }
    else { setSelectedLesson(lesson); setScreen("quiz"); }
  };

  const handleQuizDone = (result) => {
    const pct = result.pct ?? Math.round(((result.score || 0) / (result.total || 1)) * 100);
    const resultWithPct = { ...result, pct };
    const earned = Math.round((result.score || 0) * 2);
    const xpEarned = Math.round(pct / 5) + 5;
    const newStats = [...stats, {
      ...resultWithPct,
      date: new Date().toISOString(),
      title: lang === "kz" ? selectedLesson?.title?.kz : selectedLesson?.title?.ru,
      lessonId: selectedLesson?.id,
    }];
    setStats(newStats);
    localStorage.setItem("bilim_stats", JSON.stringify(newStats));
    addCoins(earned);
    addXp(xpEarned);
    checkAchievements();
    setQuizResult({ ...resultWithPct, coinsEarned: earned, xpEarned });
    setScreen("result");
  };

  const handlePaymentDone = () => {
    setIsPaid(true);
    localStorage.setItem("bilim_paid", "1");
    setScreen(selectedLesson ? "quiz" : "home");
  };

  const handleBuyAvatar = (newAvatar, price) => {
    if (price > 0 && coins < price) return false;
    if (price > 0) addCoins(-price);
    setAvatar(newAvatar);
    localStorage.setItem("bilim_avatar", newAvatar);
    const bought = JSON.parse(localStorage.getItem("bilim_bought") || "[]");
    if (!bought.includes(newAvatar)) { bought.push(newAvatar); localStorage.setItem("bilim_bought", JSON.stringify(bought)); }
    checkAchievements({ boughtCount: bought.length });
    return true;
  };

  const handleRiddleSolved = (coinsEarned) => {
    addCoins(coinsEarned);
    addXp(10);
    checkAchievements();
    const solved = parseInt(localStorage.getItem("bilim_riddles_solved") || "0") + 1;
    localStorage.setItem("bilim_riddles_solved", solved);
  };

  const handleLangToggle = () => {
    const next = lang === "kz" ? "ru" : "kz";
    setLang(next);
    localStorage.setItem("bilim_lang", next);
  };

  if (!onboardingDone) {
    return (
      <Onboarding onDone={(name, chosenLang) => {
        if (name) localStorage.setItem("bilim_name", name.trim());
        if (chosenLang) { setLang(chosenLang); localStorage.setItem("bilim_lang", chosenLang); }
        localStorage.setItem("bilim_onboarded", "1");
        setOnboardingDone(true);
      }} />
    );
  }

  const screens = {
    home: <Home lang={lang} t={t} onAgeSelect={(g)=>{setAgeGroup(g);setScreen("lessons");}}
      streak={streak} coins={coins} avatar={avatar} xp={xp} achievements={achievements}
      onShop={()=>setScreen("shop")} onParent={()=>setScreen("parent")}
      onRiddles={()=>setScreen("riddles")} onGames={()=>setScreen("games")}
      onProfile={()=>setScreen("profile")} onMissions={()=>setScreen("missions")}
      onLeaderboard={()=>setScreen("leaderboard")} onElla={()=>setScreen("ella")}
      onLangToggle={handleLangToggle} streakLost={streakLost}
      onDismissStreak={()=>setStreakLost(false)} />,
    lessons: <LessonList lang={lang} t={t} ageGroup={ageGroup}
      onLessonSelect={handleLessonSelect} onBack={()=>setScreen("home")} stats={stats} />,
    quiz: <QuizScreen lang={lang} t={t} lesson={selectedLesson}
      onDone={handleQuizDone} onBack={()=>setScreen("lessons")} coins={coins} />,
    paywall: <Paywall lang={lang} t={t} onPaid={handlePaymentDone} onBack={()=>setScreen(ageGroup?"lessons":"home")} />,
    result: <Result lang={lang} t={t} result={quizResult} lesson={selectedLesson}
      onHome={()=>setScreen("home")} onRetry={()=>setScreen("quiz")} totalCoins={coins} />,
    shop: <Shop lang={lang} t={t} coins={coins} currentAvatar={avatar} onBuy={handleBuyAvatar} onBack={()=>setScreen("home")} />,
    parent: <ParentDashboard lang={lang} t={t} stats={stats} onBack={()=>setScreen("home")} />,
    riddles: <Riddles lang={lang} t={t} onBack={()=>setScreen("home")} onEarn={handleRiddleSolved} />,
    games: <MiniGames lang={lang} t={t} onBack={()=>setScreen("home")} coins={coins} onEarn={addCoins} />,
    profile: <Profile lang={lang} t={t} avatar={avatar} coins={coins} xp={xp} streak={streak}
      achievements={achievements} stats={stats} onBack={()=>setScreen("home")}
      onBuyAvatar={handleBuyAvatar} isPaid={isPaid} />,
    missions: <DailyMissions lang={lang} t={t} stats={stats} streak={streak} onBack={()=>setScreen("home")} onEarn={(c)=>{addCoins(c);addXp(20);}} />,
    leaderboard: <Leaderboard lang={lang} t={t} xp={xp} onBack={()=>setScreen("home")} />,
    ella: <EllaAI lang={lang} onBack={()=>setScreen("home")} />,
  };

  return <ErrorBoundary key={screen}>{screens[screen] || screens.home}</ErrorBoundary>;
}
