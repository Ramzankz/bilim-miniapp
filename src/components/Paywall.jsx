import { useState } from "react";

export default function Paywall({ lang, t, onPaid, onBack }) {
  const [plan, setPlan] = useState("year");

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
    t("✅ Барлық сабақтар шектеусіз", "✅ Все уроки без ограничений"),
    t("✅ Жаңа тақырыптар жетіледі", "✅ Новые темы каждый месяц"),
    t("✅ Жарнамасыз", "✅ Без рекламы"),
    t("✅ Екі тілде: қазақша + орысша", "✅ На двух языках"),
  ];

  return (
    <div className="screen paywall-screen">
      <button className="back-btn" onClick={onBack}>✕</button>

      <div className="paywall-icon">🚀</div>
      <h2 className="paywall-title">{t("Толық қатынас", "Полный доступ")}</h2>
      <p className="trial-badge">🎁 {t("3 күн тегін сынап көр!", "3 дня бесплатно!")}</p>

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
        <p className="kaspi-title">📲 {t("Kaspi арқылы төлеу:", "Оплата через Kaspi:")}</p>
        <p className="kaspi-number">+7 700 000 0000</p>
        <p className="kaspi-amount">
          {t("Сома:", "Сумма:")} <strong>{plans[plan].price}</strong>
        </p>
        <p className="kaspi-note">
          {t(
            "Төлегеннен кейін скриншотты @BilimAppBot-қа жіберіңіз",
            "После оплаты отправьте скриншот в @BilimAppBot"
          )}
        </p>
      </div>

      <button className="pay-btn" onClick={onPaid}>
        {t("Төлем жасадым ✅", "Я оплатил ✅")}
      </button>
    </div>
  );
}
