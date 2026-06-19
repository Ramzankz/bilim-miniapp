import { useState } from "react";

export default function Paywall({ lang, t, onPaid, onBack }) {
  const [selected, setSelected] = useState("month");

  const plans = {
    month: { label: t("Ay sayyn", "Ezhemesyachno"), price: "1 990 T", period: t("/ay", "/mes"), badge: null },
    year:  { label: t("Zhyldyq", "Godovoy"),      price: "15 000 T", period: t("/zhyl", "/god"), badge: t("Fire Unemdi!", "Fire Vygodno!") },
    once:  { label: t("Bir ret", "Razovo"),        price: "5 000 T",  period: "", badge: null },
  };
  const current = plans[selected];

  return (
    <div className="screen paywall-screen">
      <button className="back-btn" onClick={onBack}>&lt;- {t("Artqa", "Nazad")}</button>
      <div className="paywall-content">
        <div className="paywall-icon">Rocket</div>
        <h2>{t("Tolyk dostup", "Polnyy dostup")}</h2>
        <div className="trial-badge">Gift {t("3 kun tegin synap kor!", "3 dnya besplatno!")}</div>

        <div className="plan-tabs">
          {Object.entries(plans).map(([key, plan]) => (
            <button key={key} className={`plan-tab ${selected === key ? "active" : ""}`} onClick={() => setSelected(key)}>
              {plan.badge && <span className="plan-badge">{plan.badge}</span>}
              <span className="plan-label">{plan.label}</span>
              <span className="plan-price">{plan.price}{plan.period}</span>
            </button>
          ))}
        </div>

        <ul className="benefits">
          <li>OK {t("Barlyk 20 sabaq", "Vse 20 urokov")}</li>
          <li>OK {t("2 zhas toby", "2 vozrasta")}</li>
          <li>OK {t("Sheksiz qaytalau", "Bez ogranicheniy")}</li>
          <li>OK {t("Zhanа sabaqtar tegin", "Novye uroki besplatno")}</li>
          <li>OK {t("Coin Tiyn zhynaу", "Coin Sistema monet")}</li>
        </ul>

        <div className="kaspi-section">
          <p className="kaspi-label">Phone {t("Kaspi Pay arqyly toleniz:", "Oplatite cherez Kaspi Pay:")}</p>
          <div className="kaspi-qr-placeholder">
            <p>Camera QR-kod</p>
            <p className="qr-hint">{current.price}</p>
          </div>
          <div className="kaspi-steps">
            <p>1. {t("Kaspi Pay-dy ashynyz", "Otkroyte Kaspi Pay")}</p>
            <p>2. {t("QR-dy skanerleniз", "Otskaniruyte QR")}</p>
            <p>3. {t(`${current.price} zhiberiniz`, `Perevedite ${current.price}`)}</p>
            <p>4. {t("Skrinshotti botten zhiberiniz", "Otpravte skrinshot v bot")}</p>
          </div>
        </div>

        <button className="paid-btn" onClick={onPaid}>OK {t("Toledim!", "Ya oplatil!")}</button>
        <p className="support-text">{t("Suraq bolsa:", "Po voprosam:")} @BilimAppSupport</p>
      </div>
    </div>
  );
}// ⚠️ KASPI QR суретін: src/assets/kaspi_qr.png-ге қой
// Суретті өз Kaspi QR-ыңмен ауыстыр

export default function Paywall({ lang, t, onPaid, onBack }) {
  return (
    <div className="screen paywall-screen">
      <button className="back-btn" onClick={onBack}>← {t("Артқа","Назад")}</button>

      <div className="paywall-content">
        <div className="paywall-icon">🔓</div>
        <h2>{t("Толық доступ", "Полный доступ")}</h2>

        <div className="price-tag">5 000 ₸</div>

        <ul className="benefits">
          <li>✅ {t("Барлық 20 сабақ", "Все 20 уроков")}</li>
          <li>✅ {t("2 жас тобы (4-6 және 7-10)", "2 возраста (4-6 и 7-10)")}</li>
          <li>✅ {t("Шексіз қайталау", "Без ограничений")}</li>
          <li>✅ {t("Жаңа сабақтар тегін", "Новые уроки бесплатно")}</li>
        </ul>

        <div className="kaspi-section">
          <p className="kaspi-label">
            📲 {t("Kaspi Pay арқылы төлеңіз:", "Оплатите через Kaspi Pay:")}
          </p>

          {/* ⬇️ Өз QR суретіңді осы жерге қой */}
          <div className="kaspi-qr-placeholder">
            <p>📷 QR-код</p>
            <p className="qr-hint">
              {t("kaspi_qr.png суретін /src/assets/ ішіне қой", "Замени на свой QR из Kaspi")}
            </p>
            {/* <img src="/kaspi_qr.png" alt="Kaspi QR" className="kaspi-qr" /> */}
          </div>

          <div className="kaspi-steps">
            <p>1. {t("Kaspi Pay-ды ашыңыз", "Откройте Kaspi Pay")}</p>
            <p>2. {t("QR-ды сканерлеңіз", "Отсканируйте QR")}</p>
            <p>3. {t("5 000 ₸ жіберіңіз", "Переведите 5 000 ₸")}</p>
            <p>4. {t("Скриншотты боттан жіберіңіз", "Отправьте скриншот в бот")}</p>
          </div>
        </div>

        <button className="paid-btn" onClick={onPaid}>
          ✅ {t("Төледім!", "Я оплатил!")}
        </button>

        <p className="support-text">
          {t("Сұрақ болса:", "По вопросам:")} @BilimAppSupport
        </p>
      </div>
    </div>
  );
}
