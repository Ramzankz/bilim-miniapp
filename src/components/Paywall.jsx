import { useState } from "react";

export default function Paywall({ lang, t, onPaid, onBack }) {
  const [selected, setSelected] = useState("month");

  const plans = {
    month: {
      label: t("Ay sayyn", "Ezhemesyachno"),
      price: "1 990 T",
      period: t("/ay", "/mes"),
      badge: null,
    },
    year: {
      label: t("Zhyldyq", "Godovoy"),
      price: "15 000 T",
      period: t("/zhyl", "/god"),
      badge: t("Fire Unemdi!", "Fire Vygodno!"),
    },
    once: {
      label: t("Bir ret", "Razovo"),
      price: "5 000 T",
      period: "",
      badge: null,
    },
  };

  const current = plans[selected];

  return (
    <div className="screen paywall-screen">
      <button className="back-btn" onClick={onBack}>{t("Artqa", "Nazad")}</button>

      <div className="paywall-content">
        <div className="paywall-icon">Rocket</div>
        <h2>{t("Tolyk dostup", "Polnyy dostup")}</h2>

        <div className="trial-badge">
          Gift {t("3 kun tegin synap kor!", "3 dnya besplatno!")}
        </div>

        <div className="plan-tabs">
          {Object.entries(plans).map(([key, plan]) => (
            <button
              key={key}
              className={`plan-tab ${selected === key ? "active" : ""}`}
              onClick={() => setSelected(key)}
            >
              {plan.badge && <span className="plan-badge">{plan.badge}</span>}
              <span className="plan-label">{plan.label}</span>
              <span className="plan-price">{plan.price}{plan.period}</span>
            </button>
          ))}
        </div>

        <ul className="benefits">
          <li>OK {t("Barlyq 20 sabaq", "Vse 20 urokov")}</li>
          <li>OK {t("2 zhas toby (4-6 zhane 7-10)", "2 vozrasta (4-6 i 7-10)")}</li>
          <li>OK {t("Sheksiz qaytalau", "Bez ogranicheniy")}</li>
          <li>OK {t("Zhana sabaqtar tegin", "Novye uroki besplatno")}</li>
          <li>OK Coin {t("Tiyn zhynau zhuiesi", "Sistema monet")}</li>
        </ul>

        <div className="kaspi-section">
          <p className="kaspi-label">
            Phone {t("Kaspi Pay arqyly toleniz:", "Oplatite cherez Kaspi Pay:")}
          </p>

          <div className="kaspi-qr-placeholder">
            <p>QR-kod</p>
            <p className="qr-hint">{current.price}</p>
          </div>

          <div className="kaspi-steps">
            <p>1. {t("Kaspi Pay-dy ashynyz", "Otkroyte Kaspi Pay")}</p>
            <p>2. {t("QR-dy skanerlenis", "Otskanirujte QR")}</p>
            <p>3. {t(`${current.price} zhiberiniz`, `Perevedite ${current.price}`)}</p>
            <p>4. {t("Skrinshotti bottан zhiberiniz", "Otpravte skrinsho v bot")}</p>
          </div>
        </div>

        <button className="paid-btn" onClick={onPaid}>
          OK {t("Toledim!", "Ya oplatil!")}
        </button>

        <p className="support-text">
          {t("Suraq bolsa:", "Po voprosam:")} @BilimAppSupport
        </p>
      </div>
    </div>
  );
}
