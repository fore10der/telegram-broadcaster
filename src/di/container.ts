import { ServiceCollection } from "https://deno.land/x/di@v0.1.1/mod.ts";
import { TOKEN } from "../configs.ts";
import Types from "../constants/Types.ts";
import TelegramBot from "../enitities/TelegramBot.ts";

const container = new ServiceCollection();
container.addStatic(Types.TOKEN, TOKEN);
container.addTransient(TelegramBot);

export default container;
