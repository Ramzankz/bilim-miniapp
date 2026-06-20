import { useState } from "react";

const ITEMS = [
  { id: "lion",   emoji: "🦁", nameKz: "Арыстан",   nameRu: "Лев",         price: 0   },
  { id: "crown",  emoji: "👑", nameKz: "Патша",      nameRu: "Король",      price: 50  },
  { id: "rocket", emoji: "🚀", nameKz: "Ғарышкер",  nameRu: "Космонавт",   price: 100 },
  { id: "magic",  emoji: "🧙", nameKz: "Сиқыршы",   nameRu: "Волшебник",   price: 150 },
  { id: "star",   emoji: "🌟", nameKz: "Чемпион",   nameRu: "Чемпион",     price: 200 },
  { id: "dragon", emoji: "🐉", nameKz: "Айдаhар",   nameRu: "Дракон",      price: 300 },
];

function getBought() {
  try { return JSON.parse(localStorage.getItem("bilim_bought") || '["lion"]'); }
  catch { return ["lion"]; }
}

export default function Shop({ lang, t, coins, avatar, onBuy, onBack }) {
  const [bought, setBought] = useState(getBought);
  const [flash, setFlash] = useState(null);

  const handleSelect = (item) => {
    if (item.id === avatar) return;
    if (!bought.includes(item.id)) {
      if (coins < item.price) { setFlash(item.id); setTimeout(() => setFlash(null), 700); return; }
      const nb = [...bought, item.id];
      setBought(nb);
      localStorage.setItem("bilim_bought", JSON.stringify(nb));
      onBuy(item.id, item.price);
    } else {
      onBuy(item.id, 0);
    }
  };

  return (
    <div className="screen shop-screen">
      <div className="shop-header">
        <button className="back-btn" onClick={onBack}>✕</button>
        <h2>{t("🛍️ Дүкен", "🛍️ Магазин")}</h2>
        <span className="shop-coins">🪙 {coins}</span>
      </div>
      <p className="shop-subtitle">{t("Аватар таңда:", "Выбери аватар:")}</p>
      <div className="shop-current">
        <span className="shop-avatar-big">{ITEMS.find(i => i.id === avatar)?.emoji || "🦁"}</span>
        <span>{t("Қазіргі аватар", "Текущий аватар")}</span>
      </div>
      <div className="shop-grid">
        {ITEMS.map(item => {
          const owned = bought.includes(item.id);
          const selected = avatar === item.id;
          const tooExp = !owned && coins < item.price;
          return (
            <button
              key={item.id}
              className={`shop-item${selected ? " selected" : ""}${flash === item.id ? " shake" : ""}${tooExp ? " locked" : ""}`}
              onClick={() => handleSelect(item)}
            >
              <span className="shop-emoji">{item.emoji}</span>
              <span className="shop-name">{lang === "kz" ? item.nameKz : item.nameRu}</span>
              {selected && <span className="shop-tag selected-tag">✅ {t("Таңдалды","Выбрано")}</span>}
              {!selected && owned && <span className="shop-tag owned-tag">{t("Таңда","Выбрать")}</span>}
              {!owned && <span className={`shop-tag price-tag${tooExp ? " grey" : ""}`}>🪙 {item.price}</span>}
            </button>
          );
        })}
      </div>
      <p className="shop-hint">{t("Тиын жинап, жаңа аватар сатып ал!","Зарабатывай монеты и открывай аватары!")}</p>
    </div>
  );
}
