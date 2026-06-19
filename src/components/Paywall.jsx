// ⚠️ KASPI QR суретін: src/assets/kaspi_qr.png-ге қой
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
