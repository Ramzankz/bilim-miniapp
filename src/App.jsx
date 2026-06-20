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
import "./index.css";

const tg = window.Telegram?.WebApp;

export default function App() {
  const [screen, setScreen]               = useState("home");
  const [ageGroup, setAgeGroup]           = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [quizResult, setQuizResult]       = useState(null);
  const [lang, setLang]                   = useState("kz");
  const [isPaid, setIsPaid]               = useState(false);
  const [coins, setCoins]                 = useState(0);
  const [streak, setStreak]               = useState(0);
  const [avatar, setAvatar]               = useState("lion");

  useEffect(() => {
    if (tg) { tg.ready(); tg.expand(); tg.setHeaderColor("#6C5CE7"); }
    if (localStorage.getItem("bilim_paid") === "true") setIsPaid(true);
    setCoins(parseInt(localStorage.getItem("bilim_coins") || "0"));
    setAvatar(localStorage.getItem("bilim_avatar") || "lion");
    const today = new Date().toDateString();
    const last  = localStorage.getItem("bilim_last_visit");
    const saved = parseInt(localStorage.getItem("bilim_streak") || "0");
    if (last === today) {
      setStreak(saved);
    } else {
      const yest = new Date(); yest.setDate(yest.getDate() - 1);
      const ns = last === yest.toDateString() ? saved + 1 : 1;
      setStreak(ns);
      localStorage.setItem("bilim_streak", ns);
      localStorage.setItem("bilim_last_visit", today);
    }
  }, []);

  const addCoins = (amount) => {
    setCoins(prev => {
      const n = Math.max(0, prev + amount);
      localStorage.setItem("bilim_coins", n);
      return n;
    });
  };

  const handleAgeSelect    = (g) => { setAgeGroup(g); setScreen("lessons"); };
  const handleLessonSelect = (l) => {
    if (!l.free && !isPaid) { setSelectedLesson(l); setScreen("paywall"); return; }
    setSelectedLesson(l); setScreen("quiz");
  };
  const handleQuizDone = (result) => {
    setQuizResult(result);
    const earned = result.score * 10;
    addCoins(earned);
    result.coinsEarned = earned;
    try {
      const prev = JSON.parse(localStorage.getItem("bilim_stats") || "[]");
      prev.push({ title: selectedLesson?.title?.[lang] || selectedLesson?.title?.kz || "Сабақ", score: result.score, total: result.total, date: new Date().toISOString() });
      localStorage.setItem("bilim_stats", JSON.stringify(prev.slice(-100)));
    } catch {}
    setScreen("result");
  };
  const handlePaymentDone = () => {
    alert(lang === "kz" ? "✅ Скриншотты @BilimAppBot-қа жіберіңіз!" : "✅ Отправьте скриншот в @BilimAppBot!");
    setScreen("lessons");
  };
  const handleBuyAvatar = (itemId, price) => {
    if (price > 0) addCoins(-price);
    setAvatar(itemId);
    localStorage.setItem("bilim_avatar", itemId);
  };

  const t = (kz, ru) => lang === "kz" ? kz : ru;

  const go  = (s) => setScreen(s);
  const home = () => setScreen("home");

  return (
    <div className="app">
      {/* Жоғарғы панель — барлық экранда */}
      <div className="top-bar">
        <div className="coins-display">🪙 <span>{coins}</span></div>
        {streak > 0 && <div className="streak-display">🔥 <span>{streak}</span></div>}
        <div className="lang-toggle">
          <button className={lang === "kz" ? "active" : ""} onClick={() => setLang("kz")}>ҚАЗ</button>
          <button className={lang === "ru" ? "active" : ""} onClick={() => setLang("ru")}>РУС</button>
        </div>
      </div>

      {screen === "home"    && <Home lang={lang} t={t} onAgeSelect={handleAgeSelect} streak={streak} coins={coins} avatar={avatar} onShop={() => go("shop")} onParent={() => go("parent")} onRiddles={() => go("riddles")} onGames={() => go("games")} />}
      {screen === "lessons" && <LessonList lang={lang} t={t} ageGroup={ageGroup} isPaid={isPaid} onLessonSelect={handleLessonSelect} onBack={home} />}
      {screen === "quiz"    && <QuizScreen lang={lang} t={t} lesson={selectedLesson} onDone={handleQuizDone} onBack={() => go("lessons")} coins={coins} />}
      {screen === "paywall" && <Paywall lang={lang} t={t} onPaid={handlePaymentDone} onBack={() => go("lessons")} />}
      {screen === "result"  && <Result lang={lang} t={t} result={quizResult} lesson={selectedLesson} onBack={() => go("lessons")} onRetry={() => go("quiz")} totalCoins={coins} />}
      {screen === "shop"    && <Shop lang={lang} t={t} coins={coins} avatar={avatar} onBuy={handleBuyAvatar} onBack={home} />}
      {screen === "parent"  && <ParentDashboard lang={lang} t={t} onBack={home} />}
      {screen === "riddles" && <Riddles lang={lang} t={t} onBack={home} onEarn={addCoins} />}
      {screen === "games"   && <MiniGames lang={lang} t={t} onBack={home} onEarn={addCoins} />}
    </div>
  );
}
