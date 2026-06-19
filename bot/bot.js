// ============================================================
// BILIM BOT — Telegram Bot (Telegraf.js)
// npm install telegraf dotenv
// ============================================================

const { Telegraf } = require("telegraf");
require("dotenv").config();

const bot = new Telegraf(process.env.BOT_TOKEN);
const ADMIN_ID = process.env.ADMIN_ID;
const MINI_APP_URL = process.env.MINI_APP_URL;

// ── /start ──────────────────────────────────────────────────
bot.start((ctx) => {
  const firstName = ctx.from.first_name || "Достым";
  ctx.reply(
    `Сәлем, ${firstName}! 👋\n\n` +
    `🦁 *Білім* — қазақ балаларына арналған логика және математика!\n\n` +
    `🎁 5 сабақ *тегін*\n` +
    `💫 Барлық сабақтар — 5 000 ₸\n\n` +
    `Төменгі батырманы бас:`,
    {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [[
          { text: "📚 Сабақтарды ашу", web_app: { url: MINI_APP_URL } }
        ]]
      }
    }
  );
});

// ── /help ───────────────────────────────────────────────────
bot.command("help", (ctx) => {
  ctx.reply(
    "❓ *Көмек*\n\n" +
    "📲 Төлем жасаған соң осы чатқа скриншот жіберіңіз.\n" +
    "⏱ 1-2 сағат ішінде доступ беріледі.\n\n" +
    "Сұрақ: @BilimAppSupport",
    { parse_mode: "Markdown" }
  );
});

// ── Пайдаланушы скриншот жіберді ────────────────────────────
bot.on("photo", async (ctx) => {
  const userId = ctx.from.id;
  const userName = ctx.from.first_name;
  const username = ctx.from.username ? `@${ctx.from.username}` : "username жоқ";

  await bot.telegram.sendMessage(
    ADMIN_ID,
    `💰 *Жаңа төлем скриншоты!*\n\n` +
    `👤 Аты: ${userName}\n` +
    `🆔 ID: \`${userId}\`\n` +
    `📱 Username: ${username}\n\n` +
    `✅ Растау: /approve ${userId}\n` +
    `❌ Бас тарту: /reject ${userId}`,
    { parse_mode: "Markdown" }
  );

  ctx.reply(
    "✅ Скриншотыңыз қабылданды!\n\n" +
    "⏱ 1-2 сағат ішінде доступ беріледі 🙂"
  );
});

// ── /approve [user_id] ─────────────────────────────────────
bot.command("approve", async (ctx) => {
  if (String(ctx.from.id) !== String(ADMIN_ID)) return ctx.reply("⛔ Тек admin.");
  const targetId = ctx.message.text.split(" ")[1];
  if (!targetId) return ctx.reply("⚠️ /approve [user_id]");

  await bot.telegram.sendMessage(targetId,
    "🎉 *Доступ ашылды!*\n\nБарлық сабақтар қолжетімді. Жарайсың! 🦁",
    {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [[
          { text: "📚 Оқуды бастау", web_app: { url: MINI_APP_URL } }
        ]]
      }
    }
  );
  ctx.reply(`✅ ${targetId} пайдаланушыға доступ берілді!`);
});

// ── /reject [user_id] ──────────────────────────────────────
bot.command("reject", async (ctx) => {
  if (String(ctx.from.id) !== String(ADMIN_ID)) return;
  const targetId = ctx.message.text.split(" ")[1];
  if (!targetId) return ctx.reply("⚠️ /reject [user_id]");

  await bot.telegram.sendMessage(targetId,
    "❌ Төлем расталмады. Сұрақ: @BilimAppSupport"
  );
  ctx.reply(`❌ ${targetId} бас тартылды.`);
});

bot.launch();
console.log("🦁 Bilim Bot іске қосылды!");
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
