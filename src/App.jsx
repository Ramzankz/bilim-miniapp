import { useState, useEffect } from "react";
import Home from "./components/Home";
import LessonList from "./components/LessonList";
import QuizScreen from "./components/QuizScreen";
import Paywall from "./components/Paywall";
import Result from "./components/Result";
import "./index.css";

// Telegram WebApp SDK
const tg = window.Telegram?.WebApp;

export default function App() {
  const [screen, setScreen] = useState("home"); // home | lessons | quiz | paywall | result
  const [ageGroup, setAgeGroup] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [quizResult, setQuizResult] = useState(null);
  const [lang, setLang] = useState("kz"); // kz | ru
  const [isPaid, setIsPaid] = useState(false);

  useEffect(() => {
    if (tg) {
      tg.ready();
      tg.expand();
      tg.setHeaderColor("#6C5CE7");
    }
    // Төленген ба?
    const paid = localStorage.getItem("bilim_paid");
    if (paid === "true") setIsPaid(true);
  }, []);

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
    setScreen("result");
  };

  const handlePaymentDone = () => {
    // Төлем жасалды деп белгілейміз — бот растағаннан кейін ашылады
    // Қазір demo үшін: localStorage-ге сақтаймыз
    // Production-да: bottan /approve келгенде ашылады
    alert(lang === "kz"
      ? "✅ Скриншотты @BilimAppBot-қа жіберіңіз. Растағаннан кейін сабақтар ашылады!"
      : "✅ Отправьте скриншот в @BilimAppBot. После подтверждения уроки откроются!");
    setScreen("lessons");
  };

  const t = (kzText, ruText) => lang === "kz" ? kzText : ruText;

  return (
    <div className="app">
      {/* Тіл ауыстыру */}
      <div className="lang-toggle">
        <button
          className={lang === "kz" ? "active" : ""}
          onClick={() => setLang("kz")}
        >ҚАЗ</button>
        <button
          className={lang === "ru" ? "active" : ""}
          onClick={() => setLang("ru")}
        >РУС</button>
      </div>

      {screen === "home" && (
        <Home lang={lang} t={t} onAgeSelect={handleAgeSelect} />
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
        />
      )}
    </div>
  );
}
