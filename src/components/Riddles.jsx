import { useState } from "react";

const RIDDLES = [
  { e:"📅", kz:"Жылда бір рет туылады, ай сайын өледі. Бұл не?", ru:"Рождается раз в году, умирает каждый месяц. Что?", ak:"Ай (Calendar)", ar:"Месяц (Calendar)" },
  { e:"🔑", kz:"Аяғы да, қолы да жоқ, бірақ есікті ашады. Бұл не?", ru:"Нет ног, нет рук, но дверь открывает. Что?", ak:"Кілт", ar:"Ключ" },
  { e:"🌊", kz:"Өзі жоқ, іші де жоқ, бірақ толтырады. Бұл не?", ru:"Сам пустой, но всё заполняет. Что?", ak:"Су", ar:"Вода" },
  { e:"💡", kz:"Ол жарықтандырады, бірақ жанбайды. Бұл не?", ru:"Светит, но не горит. Что?", ak:"Жарық шам / Ай", ar:"Лампочка / Луна" },
  { e:"🚪", kz:"Бар, бірақ ауызы жоқ. Жоқ, бірақ аяғы бар. Бұл не?", ru:"Есть, но без рта. Нет, но с ногой. Что?", ak:"Есік", ar:"Дверь" },
  { e:"🌳", kz:"Жазда киінеді, қыста шешінеді. Бұл не?", ru:"Летом одевается, зимой раздевается. Что?", ak:"Ағаш", ar:"Дерево" },
  { e:"☁️", kz:"Жерде жүгіреді, аспанда тұрады. Бұл не?", ru:"Бежит по земле, стоит на небе. Что?", ak:"Бұлт", ar:"Облако" },
  { e:"🏰", kz:"Аузы бар, бірақ сөйлемейді. Тісі бар, бірақ жемейді. Бұл не?", ru:"Есть рот, но не говорит. Есть зубы, но не ест. Что?", ak:"Арыстан мүсіні / Тіс арасы", ar:"Расчёска" },
  { e:"📱", kz:"Қолыңда, бірақ қалтаңда. Сөйлейді, бірақ аузы жоқ. Бұл не?", ru:"В руке, но в кармане. Говорит, но без рта. Что?", ak:"Телефон", ar:"Телефон" },
  { e:"❄️", kz:"Ақ қанат, суық жан. Жерге кеп, жоғалып кетер. Бұл не?", ru:"Белые крылья, холодная душа. Упал и исчез. Что?", ak:"Қар", ar:"Снег" },
  { e:"🔍", kz:"Теледидарда сен, сенің алдыңда мен. Мен кімім?", ru:"На экране ты, передо мной тоже ты. Кто я?", ak:"Айна", ar:"Зеркало" },
  { e:"🌮", kz:"Жасыл үй, жасыл жан, тістеді, бірақ жылады. Бұл не?", ru:"Зелёный дом, зелёная душа, укусил — заплакал. Что?", ak:"Бұрыш", ar:"Перец" },
  { e:"🧠", kz:"Ешкім алмайды, ешкім бермейді, бірақ бәрінде бар. Бұл не?", ru:"Никто не даёт, никто не берёт, но у всех есть. Что?", ak:"Ой / Ақыл", ar:"Ум / Мысль" },
  { e:"🏄", kz:"Судың үстінде жүреді, бірақ суланбайды. Бұл не?", ru:"Едет по воде, но не мокнет. Что?", ak:"Кеме / Қайық", ar:"Корабль / Лодка" },
  { e:"⌚", kz:"Мың аяғы бар, бірақ жүрмейді. Бұл не?", ru:"Тысяча ног, но не ходит. Что?", ak:"Сағат", ar:"Часы" },
];

function getTodayRiddle() {
  const day = Math.floor(Date.now() / 86400000);
  return RIDDLES[day % RIDDLES.length];
}

export default function Riddles({ lang, t, onBack, onEarn }) {
  const todayKey = new Date().toDateString();
  const [solved, setSolved] = useState(() => localStorage.getItem("bilim_riddle_" + todayKey) === "1");
  const [showHint, setShowHint] = useState(false);
  const [showAnswer, setShowAnswer] = useState(solved);
  const [idx, setIdx] = useState(0);

  const riddle = RIDDLES[idx];

  const handleSolve = () => {
    setShowAnswer(true);
    if (!solved) {
      setSolved(true);
      localStorage.setItem("bilim_riddle_" + todayKey, "1");
      onEarn(10);
    }
  };

  const next = () => {
    setShowHint(false);
    setShowAnswer(false);
    setIdx(i => (i + 1) % RIDDLES.length);
  };
  const prev = () => {
    setShowHint(false);
    setShowAnswer(false);
    setIdx(i => (i - 1 + RIDDLES.length) % RIDDLES.length);
  };

  return (
    <div className="screen riddle-screen">
      <div className="riddle-header">
        <button className="back-btn" onClick={onBack}>✕</button>
        <h2>{t("🧩 Жұмбақтар", "🧩 Загадки")}</h2>
        <span className="riddle-counter">{idx + 1}/{RIDDLES.length}</span>
      </div>

      {solved && idx === RIDDLES.indexOf(getTodayRiddle()) && (
        <div className="riddle-done-badge">✅ {t("Бүгінгі жұмбақты шештің! +10 🪙", "Загадка дня решена! +10 🪙")}</div>
      )}

      <div className="riddle-card">
        <div className="riddle-emoji">{riddle.e}</div>
        <p className="riddle-text">{lang === "kz" ? riddle.kz : riddle.ru}</p>

        {!showHint && !showAnswer && (
          <button className="hint-btn" onClick={() => setShowHint(true)}>
            💡 {t("Кеңес көру", "Показать подсказку")}
          </button>
        )}
        {showHint && !showAnswer && (
          <p className="riddle-hint">💡 {t("Ойлан... жауап бір сөз!", "Подумай... ответ — одно слово!")}</p>
        )}
        {!showAnswer && (
          <button className="solve-btn" onClick={handleSolve}>
            🔍 {t("Жауабын көру", "Показать ответ")}
          </button>
        )}
        {showAnswer && (
          <div className="riddle-answer">
            🎉 {lang === "kz" ? riddle.ak : riddle.ar}
          </div>
        )}
      </div>

      <div className="riddle-nav">
        <button className="nav-btn" onClick={prev}>← {t("Алдыңғы","Пред.")}</button>
        <button className="nav-btn primary" onClick={next}>{t("Келесі","След.")} →</button>
      </div>
    </div>
  );
}
