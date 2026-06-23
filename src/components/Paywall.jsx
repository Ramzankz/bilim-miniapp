import { useState } from "react";

export default function Paywall({ lang, t, onPaid, onBack }) {
  const [plan, setPlan] = useState("year");
  const [sent, setSent] = useState(false);

  const tFn = t || ((kz, ru) => lang === "kz" ? kz : ru);

  const plans = {
    month: { kz: "Айлық", ru: "Месяц", price: "990 ₸", badge: null },
    year: {
      kz: "Жылдық",
      ru: "Год",
      price: "4 990 ₸",
      badge: { kz: "🔥 Үнемді!", ru: "🔥 Выгодно!" },
    },
  };

  const benefits = [
    tFn("✅ Барлық сабақтар шектеусіз", "✅ Все уроки без ограничений"),
    tFn("✅ Жаңа тақырыптар жетіледі", "✅ Новые темы каждый месяц"),
    tFn("✅ Жарнамасыз", "✅ Без рекламы"),
    tFn("✅ Екі тілде: қазақша + орысша", "✅ На двух языках"),
  ];

  if (sent) {
    return (
      <div className="screen paywall-screen">
        <button className="back-btn" onClick={onBack}>✕</button>
        <div className="paywall-icon">⏳</div>
        <h2 className="paywall-title">{tFn("Тексерілуде...", "Проверяем...")}</h2>
        <p style={{ textAlign: "center", padding: "1rem", color: "#666", lineHeight: 1.6 }}>
          {tFn(
            "Скриншотты @BilimAppBot-қа жіберуді ұмытпаңыз. Оператор 1–24 сағат ішінде тексереді.",
            "Не забудьте отправить скриншот в @BilimAppBot. Оператор проверит в течение 1–24 часов."
          )}
        </p>
        <p style={{ textAlign: "center", fontSize: "2rem" }}>📲</p>
        <button
          className="pay-btn"
          style={{ marginTop: "1rem", background: "#aaa" }}
          onClick={onBack}
        >
          {tFn("← Артқа", "← Назад")}
        </button>
      </div>
    );
  }

  return (
    <div className="screen paywall-screen">
      <button className="back-btn" onClick={onBack}>✕</button>

      <div className="paywall-icon">🚀</div>
      <h2 className="paywall-title">{tFn("Толық қатынас", "Полный доступ")}</h2>
      <p className="trial-badge">🎁 {tFn("3 күн тегін сынап көр!", "3 дня бесплатно!")}</p>

      <div className="plan-tabs">
        {Object.entries(plans).map(([key, p]) => (
          <button
            key={key}
            className={`plan-tab ${plan === key ? "active" : ""}`}
            onClick={() => setPlan(key)}
          >
            {p.badge && <span className="plan-badge">{lang === "kz" ? p.badge.kz : p.badge.ru}</span>}
            <span>{lang === "kz" ? p.kz : p.ru}</span>
            <strong>{p.price}</strong>
          </button>
        ))}
      </div>

      <ul className="benefits-list">
        {benefits.map((b, i) => <li key={i}>{b}</li>)}
      </ul>

      <div className="kaspi-section">
        <p className="kaspi-title">📲 {tFn("Kaspi арқылы төлеу:", "Оплата через Kaspi:")}</p>
        <div className="kaspi-qr-wrap">
          <img
            src="/kaspi_qr.png"
            alt="Kaspi QR"
            className="kaspi-qr"
            onError={(e) => { e.target.style.display = "none"; }}
            style={{ width: "160px", height: "160px", borderRadius: "12px" }}
          />
          <p className="kaspi-scan-hint" style={{ fontSize: "0.85rem", color: "#888", marginTop: "6px" }}>
            {tFn("Kaspi QR сканерле", "Сканируй Kaspi QR")}
          </p>
        </div>
        <p className="kaspi-number">+7 700 000 0000</p>
        <p className="kaspi-amount">
          {tFn("Сома:", "Сумма:")} <strong>{plans[plan].price}</strong>
        </p>
        <p className="kaspi-note">
          {tFn(
            "Төлегеннен кейін скриншотты @BilimAppBot-қа жіберіңіз",
            "После оплаты отправьте скриншот в @BilimAppBot"
          )}
        </p>
      </div>

      <button className="pay-btn" onClick={() => setSent(true)}>
        {tFn("Төлем жасадым ✅", "Я оплатил ✅")}
      </button>
    </div>
  );
}
