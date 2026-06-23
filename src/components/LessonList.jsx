import lessons from "../data/lessons";

const GROUP_META = {
  "4-6":   { emoji: "🧸", labelKz: "Кішкентайлар 🧸", labelRu: "Малыши 🧸" },
  "7-10":  { emoji: "🚀", labelKz: "Зерттеушілер 🚀", labelRu: "Исследователи 🚀" },
  "10-13": { emoji: "🔬", labelKz: "Зерделілер 🔬", labelRu: "Исследователи 🔬" },
};

export default function LessonList({ lang, t, ageGroup, onLessonSelect, onBack, stats }) {
  const completedIds = new Set((stats || []).map(s => s.lessonId).filter(Boolean));

  const group = lessons[ageGroup] || [];
  const meta = GROUP_META[ageGroup] || { emoji: "📚", labelKz: ageGroup, labelRu: ageGroup };
  const groupLabel = lang === "kz" ? meta.labelKz : meta.labelRu;

  const tFn = t || ((kz, ru) => lang === "kz" ? kz : ru);

  return (
    <div className="screen lesson-list-screen">
      <div className="lesson-list-header">
        <button className="back-btn" onClick={onBack}>← {tFn("Артқа", "Назад")}</button>
        <h2 className="lesson-list-title">{groupLabel}</h2>
      </div>

      <div className="lessons-grid">
        {group.map((lesson, idx) => {
          const isDone = completedIds.has(lesson.id);
          const title = lang === "kz" ? lesson.title?.kz : lesson.title?.ru;
          const isLocked = lesson.locked;
          const isFree = lesson.free;

          return (
            <button
              key={lesson.id || idx}
              className={`lesson-card ${isLocked ? "locked" : ""} ${isDone ? "done" : ""}`}
              onClick={() => onLessonSelect(lesson)}
            >
              <div className="lesson-card-top">
                <span className="lesson-emoji">{lesson.emoji || "📖"}</span>
                {isDone && <span className="lesson-done-badge">✅</span>}
                {isLocked && <span className="lesson-lock">🔒</span>}
                {!isLocked && !isFree && <span className="lesson-premium">⭐</span>}
              </div>
              <p className="lesson-title">{title}</p>
              {lesson.questions && (
                <span className="lesson-q-count">{lesson.questions.length} {tFn("сұрақ", "вопр.")}</span>
              )}
              {isLocked && (
                <span className="lesson-locked-label">{tFn("Толық доступ", "Полный доступ")}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
