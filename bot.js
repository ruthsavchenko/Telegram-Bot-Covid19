require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const api = require('covid19-api');
const COUNTRIES_LIST = require('./constants');

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.start((ctx) => ctx.reply(`
Hi ${ctx.message.from.first_name}!
Find out the coronovirus statistics. Enter the name of the country for which you want to get results. You can see the list of countries with the command /help. 
`, Markup.keyboard([
    ['US', 'Ukraine'],
    ['France', 'UK'],
    ['Germany', 'Russia'],
]).resize()
));
bot.help((ctx) => ctx.reply(COUNTRIES_LIST));
bot.on('text', async (ctx) => {
    let data = {};

    try {
        data = await api.getReportsByCountries(ctx.message.text);

        const formatData = `
Country: ${data[0][0].country}
Cases: ${data[0][0].cases}
Deaths: ${data[0][0].deaths}
Recovered: ${data[0][0].recovered}
    `;

        ctx.reply(formatData);
    } catch {
        ctx.reply("Error, this country doesn't exist, enter /help")
    }
});
bot.launch();

console.log('Bot started')
