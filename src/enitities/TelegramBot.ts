import {
  Bot as GrammyBot,
  InlineKeyboard,
} from "https://deno.land/x/grammy@v1.9.0/mod.ts";
import { Inject, Service } from "https://deno.land/x/di@v0.1.1/decorators.ts";
import { Bot } from "../interfaces/Bot.ts";
import Types from "../constants/Types.ts";
import TelegramBroadcaster, {
  BroadcasterContext,
} from "./TelegramBroadcaster.tsx";

@Service()
class TelegramBot implements Bot {
  private bot: GrammyBot<BroadcasterContext>;

  constructor(
    @Inject(Types.TOKEN) token: string,
    @Inject() broadcaster: TelegramBroadcaster,
  ) {
    const bot = new GrammyBot<BroadcasterContext>(token); // <-- place your bot token inside this string
    const keyboard = new InlineKeyboard()
      .text("« 1", "first")
      .text("‹ 3", "prev")
      .text("· 4 ·", "stay")
      .text("5 ›", "next")
      .text("31 »", "last");

    // Listen for messages
    bot.use(broadcaster.middleware());
    bot.command(
      "start",
      (ctx) =>
        ctx.reply(
          "Welcome! Send me a message then do forward on it to broadcast",
        ),
    );
    bot.command("keyboard", (ctx) =>
      ctx.reply("Keyboard", {
        reply_markup: keyboard,
      }));
    bot.command("forward", async (ctx) => {
      if (ctx?.message?.reply_to_message) {
        const {
          message: {
            reply_to_message: {
              message_id: messageId,
              reply_markup: markup,
              chat: { id: chatId },
            },
          },
        } = ctx;


        await ctx.broadcast({
          toChatIds: [],
          fromChatId: chatId,
          messageId: messageId,
          markup
        });
        await ctx.reply("broadcast completed");
      }
    });

    this.bot = bot;
  }

  launch() {
    this.bot.start().then(() => {
      console.log("launched");
    });
  }
}

export default TelegramBot;
