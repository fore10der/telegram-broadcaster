import { Bot as GrammyBot } from "https://deno.land/x/grammy@v1.9.0/mod.ts";
import {Inject, Service} from "https://deno.land/x/di@v0.1.1/decorators.ts";
import { Bot } from "../interfaces/Bot.ts";
import Types from "../constants/Types.ts";

@Service()
class TelegramBot implements Bot {
  private bot: GrammyBot;

  constructor(@Inject(Types.TOKEN) token: string) {
    const bot = new GrammyBot(token); // <-- place your bot token inside this string

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

    this.bot = bot
  }

  launch() {
    this.bot.start().then(() => {
      console.log('launched')
    })
  }
}

export default TelegramBot;