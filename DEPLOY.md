# 🚀 BILIM MINIAPP — Іске қосу нұсқаулығы

## 1-ҚАДАМ: GitHub-қа жүктеу

```bash
git init
git add .
git commit -m "first commit"
git remote add origin https://github.com/сенің_username/bilim-miniapp.git
git push -u origin main
```

---

## 2-ҚАДАМ: Vercel-ге деплой

1. https://vercel.com → GitHub-пен кір
2. "New Project" → bilim-miniapp repo-ны таңда
3. Deploy басы
4. URL-ды көшіріп ал (мысалы: `https://bilim-miniapp.vercel.app`)

---

## 3-ҚАДАМ: Telegram Bot жасау

1. @BotFather-ге жаз: `/newbot`
2. Атын бер: `Bilim Bot`
3. Username бер: `BilimAppBot` (немесе өзің ойлаған)
4. Token-ды сақта: `7123456789:AAFxxxxxx`

**Mini App орнату:**
```
/newapp → бот таңда → URL кір (Vercel URL)
```

---

## 4-ҚАДАМ: Bot-ты іске қосу

```bash
cd bot
npm init -y
npm install telegraf dotenv

# .env файлын жаса:
cp ../.env.example .env
# .env ішіне BOT_TOKEN, ADMIN_ID, MINI_APP_URL жаз

node bot.js
```

**Admin ID-ті қалай табасың:**
@userinfobot-қа /start жіберсең — ID-ің шығады.

---

## 5-ҚАДАМ: Kaspi QR қосу

1. Kaspi бизнес аккаунтынан QR жасап ал
2. QR суретін `public/kaspi_qr.png`-ге сақта
3. `src/components/Paywall.jsx` ішіндегі мына жолды ашып қой:
   ```jsx
   <img src="/kaspi_qr.png" alt="Kaspi QR" className="kaspi-qr" />
   ```
   Және placeholder div-ті жабып қой.

---

## ЖҰМЫС СХЕМАСЫ

```
Пайдаланушы → /start → Mini App ашылады
                    → 5 тегін сабақ оқиды
                    → 🔒 сабаққа тигенде → Paywall
                    → Kaspi QR сканерлейді → 5000₸ жібереді
                    → Скриншот ботқа жібереді
                    → Сен /approve [id] жазасың
                    → Пайдаланушы "Доступ ашылды!" алады ✅
```

---

## ФАЙЛДАР СТРУКТУРАСЫ

```
bilim-miniapp/
├── src/
│   ├── App.jsx              ← Негізгі app, routing
│   ├── main.jsx             ← Entry point
│   ├── index.css            ← Барлық стильдер
│   ├── data/lessons.js      ← Барлық сабақтар мазмұны
│   └── components/
│       ├── Home.jsx         ← Жас таңдау экраны
│       ├── LessonList.jsx   ← Сабақтар тізімі
│       ├── QuizScreen.jsx   ← Тапсырма шешу
│       ├── Paywall.jsx      ← Kaspi QR төлем
│       └── Result.jsx       ← Нәтиже экраны
├── bot/
│   └── bot.js               ← Telegram Bot
├── index.html
├── vite.config.js
├── package.json
└── .env.example
```
