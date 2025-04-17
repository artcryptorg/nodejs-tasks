import 'dotenv/config';
import { Telegraf } from "telegraf";

const token = process.env.TOKEN;
if (!token) {
    throw new Error('не задан токен');
}
const bot = new Telegraf(token);

bot.start(ctx => {
    return ctx.reply(`Hello ${ctx.update.message.from.first_name}!`);
  });


bot.launch();
