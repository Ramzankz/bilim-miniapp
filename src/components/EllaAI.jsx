import { useState, useRef, useEffect } from "react";

const RIDDLES = [
  { q: "Қыста туып, жазда өледі — бұл не?", a: "Қар" },
  { q: "Тіссіз шайнайды, аяқсыз жүреді — бұл не?", a: "Өзен" },
  { q: "Күніне бір рет тамақ жейді — бұл не?", a: "Пеш" },
];

const FACTS = [
  "🌍 Жер планетасы 4,5 миллиард жыл бұрын пайда болған!",
  "🐬 Дельфиндер ұйықтаған кезде бір көзін ашық ұстайды.",
  "🌙 Айдан Жерге дейін 384 400 км.",
  "🦁 Арыстан тәулігіне 20 сағат ұйықтайды.",
  "🌊 Дүние жүзінің 71% суға толы.",
  "⚡ Найзағай секундына 300 000 км жылдамдықпен жүреді.",
  "🐙 Сегізаяқтың 3 жүрегі бар!",
  "🌿 Ағаштар 350 миллион жыл бұрын пайда болған.",
];

function getAIResponse(text, lang) {
  const t = text.toLowerCase();
  const isKz = lang === "kz";

  // Math detection
  const mathMatch = t.match(/(\d+)\s*([+\-*×x÷/])\s*(\d+)/);
  if (mathMatch) {
    const a = parseInt(mathMatch[1]);
    const op = mathMatch[2];
    const b = parseInt(mathMatch[3]);
    let res;
    if (op === "+" ) res = a + b;
    else if (op === "-") res = a - b;
    else if (op === "*" || op === "×" || op === "x") res = a * b;
    else if (op === "/" || op === "÷") res = b !== 0 ? (a / b).toFixed(2) : "∞";
    return isKz ? `🔢 Жауабы: ${res}\n\nТамаша мысал!` : `🔢 Ответ: ${res}\n\nОтличный пример!`;
  }

  // Greetings
  if (/сәлем|сал|привет|hello|hi|хай/.test(t)) {
    return isKz
      ? "👋 Сәлем! Мен Элла — сенің AI оқу көмекшің!\n\nМаған кез-келген сұрақ қоя аласың:\n• Математика есептер 🔢\n• Қызықты фактілер 🌍\n• Жұмбақтар 🧩\n• Ғылым туралы 🔬"
      : "👋 Привет! Я Элла — твой AI помощник!\n\nСпрашивай меня про:\n• Математику 🔢\n• Интересные факты 🌍\n• Загадки 🧩\n• Науку 🔬";
  }

  // Riddle request
  if (/жұмбақ|загадка|загадай|жұмбақ айт/.test(t)) {
    const r = RIDDLES[Math.floor(Math.random() * RIDDLES.length)];
    return isKz
      ? `🧩 Мынаны шеш:\n\n${r.q}\n\n💭 Жауабы: ||${r.a}||\n(Жауапты ойланып тап!)`
      : `🧩 Отгадай:\n\n${r.q}\n\n💭 Ответ: ||${r.a}||\n(Подумай хорошенько!)`;
  }

  // Fact request
  if (/факт|интересн|қызықты|айт|расскажи/.test(t)) {
    const f = FACTS[Math.floor(Math.random() * FACTS.length)];
    return isKz ? `🌟 Қызықты факт:\n\n${f}` : `🌟 Интересный факт:\n\n${f}`;
  }

  // Science keywords
  if (/жер|планета|ғарыш|cosmos|space|земля/.test(t)) {
    return isKz
      ? "🌍 Жер — күн жүйесіндегі 3-ші планета. Диаметрі 12 742 км. Тек осы планетада тіршілік бар деп есептейді!"
      : "🌍 Земля — третья планета от Солнца. Диаметр — 12 742 км. Единственная известная нам планета с жизнью!";
  }

  if (/су|вода|water/.test(t)) {
    return isKz
      ? "💧 Су — H₂O молекуласынан тұрады. Адам денесі 60% судан тұрады. Жер бетінің 71% су!"
      : "💧 Вода — молекула H₂O. Тело человека на 60% состоит из воды. 71% земли покрыто водой!";
  }

  if (/жануар|животн|хайуан/.test(t)) {
    return isKz
      ? "🐾 Жер бетінде 8,7 миллион жануар түрі бар! Соның ішінде 6,5 миллионы — жерде, 2,2 миллионы — суда тіршілік етеді."
      : "🐾 На Земле около 8,7 миллиона видов животных! Из них 6,5 млн живут на суше, 2,2 млн — в воде.";
  }

  if (/казахстан|қазақстан/.test(t)) {
    return isKz
      ? "🇰🇿 Қазақстан — дүние жүзіндегі ең үлкен жер тіресіз ел (9-шы орын). Астанасы — Астана. 19 миллион халық тұрады."
      : "🇰🇿 Казахстан — 9-я по площади страна мира без выхода к морю. Столица — Астана. Население — около 19 миллионов.";
  }

  if (/математика|санау|сан|число|math/.test(t)) {
    return isKz
      ? "🔢 Математика — барлық ғылымның негізі!\n\nМаған мысал жаз, мен шешемін:\n• 15 + 27\n• 100 - 38\n• 6 × 7\n• 144 ÷ 12"
      : "🔢 Математика — основа всех наук!\n\nНапиши мне пример, я решу:\n• 15 + 27\n• 100 - 38\n• 6 × 7\n• 144 ÷ 12";
  }

  if (/неше|нешe|сколько|how many|қанша/.test(t)) {
    return isKz
      ? "🤔 Сан туралы сұрақ қойдың ба? Нақтырақ айт, мен жауап берейін!\n\nМысалы: 'Күнде неше сағат бар?' → 24 сағат!"
      : "🤔 Ты спросил о числе? Уточни вопрос, и я отвечу!\n\nНапример: 'Сколько часов в сутках?' → 24 часа!";
  }

  // Default responses
  const defaults = isKz ? [
    "🤔 Қызықты сұрақ! Мен одан да қызықтырақ нәрсе айтайын:\n\n" + FACTS[Math.floor(Math.random() * FACTS.length)],
    "💡 Білесің бе, маған математика, ғылым, немесе жануарлар туралы сұрақ қоя аласың!",
    "🌟 Жақсы сұрақ! Тағы да бір қызықты факт:\n\n" + FACTS[Math.floor(Math.random() * FACTS.length)],
  ] : [
    "🤔 Интересный вопрос! Вот кое-что интересное:\n\n" + FACTS[Math.floor(Math.random() * FACTS.length)],
    "💡 Знаешь, ты можешь спросить меня про математику, науку или животных!",
    "🌟 Хороший вопрос! Вот интересный факт:\n\n" + FACTS[Math.floor(Math.random() * FACTS.length)],
  ];
  return defaults[Math.floor(Math.random() * defaults.length)];
}

export default function EllaAI({ lang, onBack }) {
  const [messages, setMessages] = useState([{
    role: "ella",
    text: lang === "kz"
      ? "👋 Сәлем! Мен Элла — сенің AI оқу досың! 🤖\n\nМаған кез-келген сұрақ қоя аласың — математика, ғылым, жануарлар немесе қызықты фактілер туралы!"
      : "👋 Привет! Я Элла — твой AI помощник в учёбе! 🤖\n\nСпрашивай меня про математику, науку, животных или просто факты!",
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    setMessages(prev => [...prev, { role: "user", text }]);
    setLoading(true);
    setTimeout(() => {
      const reply = getAIResponse(text, lang);
      setMessages(prev => [...prev, { role: "ella", text: reply }]);
      setLoading(false);
    }, 600 + Math.random() * 600);
  };

  const QUICK = lang === "kz"
    ? ["Қызықты факт айт", "Жұмбақ айт", "15 × 8", "Қазақстан туралы"]
    : ["Расскажи факт", "Загадай загадку", "15 × 8", "О Казахстане"];

  return (
    <div className="ella-screen">
      <button className="back-btn" onClick={onBack}>← {lang === "kz" ? "Артқа" : "Назад"}</button>

      <div className="ella-header">
        <div className="ella-avatar-wrap">
          <span className="ella-avatar">🤖</span>
          <span className="ella-online">●</span>
        </div>
        <div>
          <div className="ella-name">Ella AI</div>
          <div className="ella-status">{lang === "kz" ? "Онлайн · Жауап беруге дайын" : "Онлайн · Готова отвечать"}</div>
        </div>
      </div>

      <div className="ella-chat">
        {messages.map((m, i) => (
          <div key={i} className={`ella-msg ella-msg-${m.role}`}>
            {m.role === "ella" && <span className="ella-msg-icon">🤖</span>}
            <div className="ella-bubble">
              {m.text.split("\n").map((line, j) => (
                <span key={j}>{line}<br /></span>
              ))}
            </div>
          </div>
        ))}
        {loading && (
          <div className="ella-msg ella-msg-ella">
            <span className="ella-msg-icon">🤖</span>
            <div className="ella-bubble ella-typing">
              <span /><span /><span />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="ella-quick-btns">
        {QUICK.map((q, i) => (
          <button key={i} className="ella-quick" onClick={() => { setInput(q); }}>
            {q}
          </button>
        ))}
      </div>

      <div className="ella-input-row">
        <input
          className="ella-input"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={lang === "kz" ? "Сұрақ жаз..." : "Напиши вопрос..."}
          onKeyDown={e => e.key === "Enter" && send()}
          maxLength={200}
        />
        <button className="ella-send-btn" onClick={send} disabled={!input.trim() || loading}>
          ➤
        </button>
      </div>
    </div>
  );
}
