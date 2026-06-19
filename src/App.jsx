import { useState, useEffect } from "react";
import Home from "./components/Home";
import LessonList from "./components/LessonList";
import QuizScreen from "./components/QuizScreen";
import Paywall from "./components/Paywall";
import Result from "./components/Result";
import "./index.css";

const tg = window.Telegram?.WebApp;

export default function App() {
  const [screen, setScreen] = useState("home");
  const [ageGroup, setAgeGroup] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [quizResult, setQuizResult] = useState(null);
  const [lang, setLang] = useState("kz");
  const [isPaid, setIsPaid] = useState(false);
  const [coins, setCoins] = useState(0);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    if (tg) {
      tg.ready();
      tg.expand();
      tg.setHeaderColor("#6C5CE7");
    }
    const paid = localStorage.getItem("bilim_paid");
    if (paid === "true") setIsPaid(true);

    const savedCoins = parseInt(localStorage.getItem("bilim_coins") || "0");
    setCoins(savedCoins);

    const today = new Date().toDateString();
    const lastVisit = localStorage.getItem("bilim_last_visit");
    const savedStreak = parseInt(localStorage.getItem("bilim_streak") || "0");

    if (lastVisit === today) {
      setStreak(savedStreak);
    } else {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      if (lastVisit === yesterday.toDateString()) {
        const newStreak = savedStreak + 1;
        setStreak(newStreak);
        localStorage.setItem("bilim_streak", newStreak);
      } else {
        setStreak(1);
        localStorage.setItem("bilim_streak", "1");
      }
      localStorage.setItem("bilim_last_visit", today);
    }
  }, []);

  const addCoins = (amount) => {
    setCoins((prev) => {
      const newTotal = prev + amount;
      localStorage.setItem("bilim_coins", newTotal);
      return newTotal;
    });
  };

  const handleAgeSelect = (group) => {
    setAgeGroup(group);
    setScreen("lessons");
  };

  const handleLessonSelect = (lesson) => {
    if (!lesson.free && !isPaid) {
      setSelectedLesson(lesson);
      setScreen("paywall");
      return;
    }
    setSelectedLesson(lesson);
    setScreen("quiz");
  };

  const handleQuizDone = (result) => {
    setQuizResult(result);
    const earned = result.score * 10;
    addCoins(earned);
    result.coinsEarned = earned;
    setScreen("result");
  };

  const handlePaymentDone = () => {
    alert(lang === "kz"
      ? "Skrinshotti @BilimAppBot-ka zhiberiniz. Rastaghannan keyin sabaqtar ashylady!"
      : "Otpravte skrinsho v @BilimAppBot. Posle podtverzhdeniya uroki otkroyutsya!");
    setScreen("lessons");
  };

  const t = (kzText, ruText) => lang === "kz" ? kzText : ruText;

  return (
    <div className="app">
      <div className="top-bar">
        <div className="coins-display">
          <span>Coin {coins}</span>
        </div>
        {streak > 0 && (
          <div className="streak-display">
            <span>Fire {streak}</span>
          </div>
        )}
        <div className="lang-toggle">
          <button className={lang === "kz" ? "active" : ""} onClick={() => setLang("kz")}>QAZ</button>
          <button className={lang === "ru" ? "active" : ""} onClick={() => setLang("ru")}>RUS</button>
        </div>
      </div>

      {screen === "home" && (
        <Home lang={lang} t={t} onAgeSelect={handleAgeSelect} streak={streak} coins={coins} />
      )}
      {screen === "lessons" && (
        <LessonList
          lang={lang} t={t}
          ageGroup={ageGroup}
          isPaid={isPaid}
          onLessonSelect={handleLessonSelect}
          onBack={() => setScreen("home")}
        />
      )}
      {screen === "quiz" && (
        <QuizScreen
          lang={lang} t={t}
          lesson={selectedLesson}
          onDone={handleQuizDone}
          onBack={() => setScreen("lessons")}
          coins={coins}
        />
      )}
      {screen === "paywall" && (
        <Paywall
          lang={lang} t={t}
          onPaid={handlePaymentDone}
          onBack={() => setScreen("lessons")}
        />
      )}
      {screen === "result" && (
        <Result
          lang={lang} t={t}
          result={quizResult}
          lesson={selectedLesson}
          onBack={() => setScreen("lessons")}
          onRetry={() => setScreen("quiz")}
          totalCoins={coins}
        />
      )}
    </div>
  );
}
