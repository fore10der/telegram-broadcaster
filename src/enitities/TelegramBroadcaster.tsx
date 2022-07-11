import { Event, Queue } from "https://deno.land/x/async@v1.1.5/mod.ts";
import { Inject, Service } from "https://deno.land/x/di@v0.1.1/decorators.ts";
import Types from "../constants/Types.ts";
import { Bot as GrammyBot } from "https://deno.land/x/grammy@v1.9.0/bot.ts";
import {Api} from "https://deno.land/x/grammy@v1.9.0/core/api.ts";
import {
  Context,
  MiddlewareFn,
} from "https://deno.land/x/grammy@v1.9.0/mod.ts";
import {InlineKeyboardMarkup} from "https://esm.sh/v86/@grammyjs/types@2.8.0/markup.d.ts";

export interface BroadcastTaskOptions {
  toChatId: number | string;
  fromChatId: number | string;
  markup?: InlineKeyboardMarkup;
  messageId: number;
}

export interface BroadcastOptions
  extends Omit<BroadcastTaskOptions, "toChatId"> {
  toChatIds: (number | string)[];
}

export type BroadcasterContext<C extends Context = Context> = C & {
  broadcast: (options: BroadcastOptions) => Promise<void>;
};

@Service()
class TelegramBroadcaster<C extends BroadcasterContext = BroadcasterContext> {
  queue: Queue<BroadcastTaskOptions>;
  closed: Event;
  private api: Api;

  constructor(@Inject(Types.TOKEN) token: string) {
    const { api } = new GrammyBot<C>(token);
    this.api = api;
    this.queue = new Queue<BroadcastTaskOptions>();
    this.closed = new Event();
    this.start();
  }

  middleware(): MiddlewareFn<C> {
    return (ctx, next) => {
      ctx.broadcast = this.broadcast;
      return next();
    };
  }

  broadcast = (options: BroadcastOptions): Promise<void> => {
    const { toChatIds, ...rest } = options;

    toChatIds.forEach(async (id) => {
      await this.queue.put({ toChatId: id, ...rest });
    });

    return Promise.resolve();
  };

  async start() {
    while (!this.closed.is_set()) {
      const received = await Promise.race([
        this.queue.get(),
        this.closed.wait(),
      ]);
      if (received === true) {
        break;
      }
      const { fromChatId, toChatId, messageId, markup } = received;
      await this.api.copyMessage(toChatId, fromChatId, messageId, {
          reply_markup: markup
      });
    }
  }
}

export default TelegramBroadcaster;
