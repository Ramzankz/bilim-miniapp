import { useState, useEffect } from "react";
import Home from "./components/Home";
import LessonList from "./components/LessonList";
import QuizScreen from "./components/QuizScreen";
import Paywall from "./components/Paywall";
import Result from "./components/Result";
import Shop from "./components/Shop";
import ParentDashboard from "./components/ParentDashboard";
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

    const saved = parseInt(localStorage.getItem("bilim_coins") || "0");
    setCoins(saved);

    const av = localStorage.getItem("bilim_avatar") || "lion";
    setAvatar(av);

    const today     = new Date().toDateString();
    const last      = localStorage.getItem("bilim_last_visit");
    const savedStr  = parseInt(localStorage.getItem("bilim_streak") || "0");
    if (last === today) {
      setStreak(savedStr);
    } else {
      const yest = new Date(); yest.setDate(yest.getDate() - 1);
      const ns = last === yest.toDateString() ? savedStr + 1 : 1;
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

  const handleAgeSelect = (group) => { setAgeGroup(group); setScreen("lessons"); };

  const handleLessonSelect = (lesson) => {
    if (!lesson.free && !isPaid) { setSelectedLesson(lesson); setScreen("paywall"); return; }
    setSelectedLesson(lesson); setScreen("quiz");
  };

  const handleQuizDone = (result) => {
    setQuizResult(result);
    const earned = result.score * 10;
    addCoins(earned);
    result.coinsEarned = earned;
    // Статистика сақтау
    try {
      const prev = JSON.parse(localStorage.getItem("bilim_stats") || "[]");
      prev.push({
        title: selectedLesson?.title?.[lang] || selectedLesson?.title?.kz || "Сабақ",
        score: result.score,
        total: result.total,
        date: new Date().toISOString(),
      });
      localStorage.setItem("bilim_stats", JSON.stringify(prev.slice(-100)));
    } catch {}
    setScreen("result");
  };

  const handlePaymentDone = () => {
    alert(lang === "kz"
      ? "✅ Скриншотты @BilimAppBot-қа жіберіңіз!"
      : "✅ Отправьте скриншот в @BilimAppBot!");
    setScreen("lessons");
  };

  const handleBuyAvatar = (itemId, price) => {
    if (price > 0) addCoins(-price);
    setAvatar(itemId);
    localStorage.setItem("bilim_avatar", itemId);
  };

  const t = (kz, ru) => lang === "kz" ? kz : ru;

  return (
    <div className="app">
      <div className="top-bar">
        <div className="coins-display">🪙 <span>{coins}</span></div>
        {streak > 0 && <div className="streak-display">🔥 <span>{streak}</span></div>}
        <div className="lang-toggle">
          <button className={lang === "kz" ? "active" : ""} onClick={() => setLang("kz")}>ҚАЗ</button>
          <button className={lang === "ru" ? "active" : ""} onClick={() => setLang("ru")}>РУС</button>
        </div>
      </div>

      {screen === "home"   && <Home lang={lang} t={t} onAgeSelect={handleAgeSelect} streak={streak} coins={coins} avatar={avatar} onShop={() => setScreen("shop")} onParent={() => setScreen("parent")} />}
      {screen === "lessons"&& <LessonList lang={lang} t={t} ageGroup={ageGroup} isPaid={isPaid} onLessonSelect={handleLessonSelect} onBack={() => setScreen("home")} />}
      {screen === "quiz"   && <QuizScreen lang={lang} t={t} lesson={selectedLesson} onDone={handleQuizDone} onBack={() => setScreen("lessons")} coins={coins} />}
      {screen === "paywall"&& <Paywall lang={lang} t={t} onPaid={handlePaymentDone} onBack={() => setScreen("lessons")} />}
      {screen === "result" && <Result lang={lang} t={t} result={quizResult} lesson={selectedLesson} onBack={() => setScreen("lessons")} onRetry={() => setScreen("quiz")} totalCoins={coins} />}
      {screen === "shop"   && <Shop lang={lang} t={t} coins={coins} avatar={avatar} onBuy={handleBuyAvatar} onBack={() => setScreen("home")} />}
      {screen === "parent" && <ParentDashboard lang={lang} t={t} onBack={() => setScreen("home")} />}
    </div>
  );
}
