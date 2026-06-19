import { getLessons } from "../data/lessons";

export default function LessonList({ lang, t, ageGroup, isPaid, onLessonSelect, onBack }) {
  const lessons = getLessons(ageGroup);
  const label = { kz: { "4-6": "Кішкентайлар 🐣", "7-10": "Ойшылдар 🦅" }, ru: { "4-6": "Малыши 🐣", "7-10": "Мыслители 🦅" } };

  return (
    <div className="screen">
      <div className="screen-header">
        <button className="back-btn" onClick={onBack}>← {t("Артқа","Назад")}</button>
        <h2>{label[lang][ageGroup]}</h2>
      </div>

      <div className="lesson-grid">
        {lessons.map((lesson, i) => {
          const locked = !lesson.free && !isPaid;
          return (
            <button
              key={lesson.id}
              className={`lesson-card ${locked ? "locked" : "unlocked"}`}
              onClick={() => onLessonSelect(lesson)}
            >
              <span className="lesson-num">{i + 1}</span>
              <span className="lesson-emoji">{lesson.emoji}</span>
              <span className="lesson-title">{lesson.title[lang]}</span>
              {locked && <span className="lock-icon">🔒</span>}
              {!locked && <span className="free-tag">
                {lesson.free ? t("Тегін","Бесплат.") : ""}
              </span>}
            </button>
          );
        })}
      </div>

      {!isPaid && (
        <div className="upgrade-banner">
          <p>🔓 {t("Барлық сабақтарды ашу үшін:", "Открыть все уроки:")}</p>
          <strong>5 000 ₸</strong>
          <button className="pay-btn" onClick={() => onLessonSelect({ free: false, locked: true })}>
            {t("Толық доступ алу", "Получить полный доступ")}
          </button>
        </div>
      )}
    </div>
  );
}
