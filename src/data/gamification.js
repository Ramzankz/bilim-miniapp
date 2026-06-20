// Gamification: XP levels, achievements, daily missions

export const LEVEL_DATA = [
  { level: 1, min: 0,    emoji: "🌱", titleKz: "Жаңадан бастаушы", titleRu: "Новичок" },
  { level: 2, min: 100,  emoji: "📖", titleKz: "Оқушы",            titleRu: "Ученик" },
  { level: 3, min: 250,  emoji: "💡", titleKz: "Білімді",           titleRu: "Знаток" },
  { level: 4, min: 500,  emoji: "⭐", titleKz: "Шебер",             titleRu: "Мастер" },
  { level: 5, min: 900,  emoji: "🏆", titleKz: "Чемпион",           titleRu: "Чемпион" },
  { level: 6, min: 1400, emoji: "🔥", titleKz: "Легенда",           titleRu: "Легенда" },
  { level: 7, min: 2000, emoji: "🌟", titleKz: "Ғұлама",            titleRu: "Мудрец" },
  { level: 8, min: 3000, emoji: "💎", titleKz: "Данышпан",          titleRu: "Гений" },
];

export function getLevel(xp) {
  let lv = LEVEL_DATA[0];
  for (const l of LEVEL_DATA) { if (xp >= l.min) lv = l; else break; }
  return lv;
}

export function getNextLevel(xp) {
  const cur = getLevel(xp);
  return LEVEL_DATA.find(l => l.level === cur.level + 1) || null;
}

export function getXpPercent(xp) {
  const cur = getLevel(xp);
  const next = getNextLevel(xp);
  if (!next) return 100;
  const progress = xp - cur.min;
  const total = next.min - cur.min;
  return Math.min(100, Math.round((progress / total) * 100));
}

export const ACHIEVEMENTS = [
  { id: "first_quiz",  emoji: "🎯", kz: "Алғашқы тест",      ru: "Первый тест",       check: s => s.quizCount >= 1 },
  { id: "perfect",     emoji: "💯", kz: "Мінсіз жауап",       ru: "Идеальный ответ",   check: s => s.perfectCount >= 1 },
  { id: "streak3",     emoji: "🔥", kz: "3 күн қатар",        ru: "3 дня подряд",      check: s => s.streak >= 3 },
  { id: "streak7",     emoji: "⚡", kz: "Апта чемпионы",      ru: "Чемпион недели",    check: s => s.streak >= 7 },
  { id: "streak14",    emoji: "🌙", kz: "2 апта",             ru: "Две недели",         check: s => s.streak >= 14 },
  { id: "coins100",    emoji: "💰", kz: "100 тиын",           ru: "100 монет",          check: s => s.coins >= 100 },
  { id: "coins500",    emoji: "💎", kz: "500 тиын",           ru: "500 монет",          check: s => s.coins >= 500 },
  { id: "xp500",       emoji: "🌟", kz: "500 XP",             ru: "500 XP",             check: s => s.xp >= 500 },
  { id: "xp2000",      emoji: "🏆", kz: "2000 XP",            ru: "2000 XP",            check: s => s.xp >= 2000 },
  { id: "shop_buy",    emoji: "🛍️", kz: "Алғашқы сатып алу", ru: "Первая покупка",    check: s => s.boughtCount >= 1 },
  { id: "riddles5",    emoji: "🧩", kz: "5 жұмбақ шештім",   ru: "5 загадок",          check: s => s.riddlesSolved >= 5 },
  { id: "riddles15",   emoji: "🎩", kz: "Жұмбақ шебері",     ru: "Мастер загадок",     check: s => s.riddlesSolved >= 15 },
  { id: "game_win",    emoji: "🎮", kz: "Ойын жеңімпазы",    ru: "Победитель игры",    check: s => s.gamesWon >= 1 },
  { id: "game5",       emoji: "🕹️", kz: "5 ойын жеңіс",      ru: "5 побед в играх",   check: s => s.gamesWon >= 5 },
  { id: "missions10",  emoji: "📋", kz: "10 тапсырма",        ru: "10 заданий",         check: s => s.missionsCompleted >= 10 },
];

const ALL_MISSIONS = [
  { id: "quiz",    emoji: "📚", kz: "1 тест тапсыр",           ru: "Пройди 1 тест",         xp: 20, coins: 10, target: 1, stat: "quizCount" },
  { id: "riddle",  emoji: "🧩", kz: "1 жұмбақ шеш",            ru: "Реши 1 загадку",        xp: 10, coins: 5,  target: 1, stat: "riddlesToday" },
  { id: "memory",  emoji: "🧠", kz: "Есте сақтауды жеңіп шық", ru: "Выиграй в память",      xp: 15, coins: 8,  target: 1, stat: "memoryWins" },
  { id: "math",    emoji: "⚡", kz: "Жылдам санауда 5+ дұрыс", ru: "5+ правильных в счёте", xp: 15, coins: 8,  target: 5, stat: "mathCorrect" },
  { id: "word",    emoji: "🔤", kz: "Сөз ойынын жеңіп шық",   ru: "Победи в слова",         xp: 15, coins: 8,  target: 1, stat: "wordWins" },
  { id: "login",   emoji: "☀️", kz: "Бүгін кіру",              ru: "Войди сегодня",          xp: 5,  coins: 3,  target: 1, stat: "loggedIn" },
  { id: "perfect", emoji: "💯", kz: "Мінсіз тест тапсыр",      ru: "Пройди тест на 100%",   xp: 25, coins: 15, target: 1, stat: "perfectCount" },
];

export function getDailyMissions(dateStr) {
  const seed = dateStr.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const shuffled = [...ALL_MISSIONS].sort((a, b) => {
    const ha = (seed * 31 + ALL_MISSIONS.indexOf(a) * 17) % 100;
    const hb = (seed * 31 + ALL_MISSIONS.indexOf(b) * 17) % 100;
    return ha - hb;
  });
  return shuffled.slice(0, 3);
}

export const FAKE_PLAYERS = [
  { name: "Айгерім К.",  xp: 2840, avatar: "🦁", city: "Алматы" },
  { name: "Берік А.",    xp: 2610, avatar: "🚀", city: "Астана" },
  { name: "Дина Т.",     xp: 2380, avatar: "🦊", city: "Шымкент" },
  { name: "Нұрлан С.",  xp: 2150, avatar: "🐯", city: "Алматы" },
  { name: "Зарина М.",   xp: 1920, avatar: "🌟", city: "Қарағанды" },
  { name: "Арман Ж.",    xp: 1750, avatar: "🐸", city: "Астана" },
  { name: "Малика Е.",   xp: 1540, avatar: "🦄", city: "Тараз" },
  { name: "Тимур Б.",    xp: 1310, avatar: "🦅", city: "Алматы" },
  { name: "Сәуле Қ.",  xp: 1080, avatar: "🐝", city: "Павлодар" },
  { name: "Ерлан Н.",   xp: 860,  avatar: "🦋", city: "Алматы" },
  { name: "Камила О.",   xp: 640,  avatar: "🐬", city: "Астана" },
  { name: "Даурен С.",   xp: 420,  avatar: "🦁", city: "Атырау" },
];
