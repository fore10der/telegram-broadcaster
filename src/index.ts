import "https://cdn.pika.dev/@abraham/reflection@^0.7.0";
import container from "./di/container.ts";
import TelegramBot from "./enitities/TelegramBot.ts";

const bot = container.get<TelegramBot>(TelegramBot)

bot.launch()