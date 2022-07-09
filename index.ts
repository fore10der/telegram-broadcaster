import { Bot } from "https://deno.land/x/grammy@v1.9.0/mod.ts";
import "./load.ts";

// Create bot object
const TOKEN = Deno.env.get("TOKEN");

if (TOKEN) {
  const bot = new Bot(TOKEN); // <-- place your bot token inside this string

  // Listen for messages
  bot.command("start", (ctx) => ctx.reply("Welcome! Send me a photo!"));
  bot.on("message:text", (ctx) => ctx.reply("That is text and not a photo!"));
  bot.on("message:photo", (ctx) => ctx.reply("Nice photo! Is that you?"));
  bot.on(
    "edited_message",
    (ctx) =>
      ctx.reply("Ha! Gotcha! You just edited this!", {
        reply_to_message_id: ctx.editedMessage.message_id,
      }),
  );

  // Launch!
  bot.start();
}
