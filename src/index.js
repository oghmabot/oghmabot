/**
 * Relative imports
 * @ignore
 */
const config = require('./config.json');
const { Arelith, Crafting, Dice, Lore } = require('./assets');
const { loggedInServersToEmbed, loggedInServersToString } = require('./util');

/**
 * External packages
 * @ignore
 */
const dotenv = require('dotenv');
const path = require('path');

/**
 * Discord.js
 * @ignore
 */
const { WebhookClient } = require('discord.js');
const { CommandoClient } = require('discord.js-commando');

/**
 * Set environment variables from .env, if present
 * @ignore
 */
dotenv.config();


/**
 * Instantiating the bot/client
 * @ignore
 */
const bot = new CommandoClient({
  owners: process.env.BOT_OWNERS,
  commandPrefix: config.prefix,
  disableEveryone: true,
  unknownCommandResponse: false
});

bot.assets = {
  Arelith, 
  Crafting, 
  Dice, 
  Lore
};
bot.defaultSettings = {
  announcementsState: false,
  statusState: false
};

// Registering various default settings as well as custom command groups
bot.registry
  .registerDefaultTypes()
  .registerGroups([
    ['standard', 'The standard commands'],
    ['crafting', 'Commands that handle crafting information'],
    ['lore', 'Commands to retrieve or poll for information about the setting'],
    ['arelith', 'Commands to check information on Arelith'],
  ])
  .registerDefaultGroups()
  .registerDefaultCommands({ ping: false, prefix: false, commandState: false })
  .registerCommandsIn(path.join(__dirname, 'commands'));

(async function () {
  /**
   * When bot is ready, output logged in servers
   * @ignore
   */
  bot.on('ready', () => {
    const { guilds } = bot;
    const wb = guilds.resolve('555159220777910273');

    if (wb && bot.mode == 'live') {
      const embedOnline = loggedInServersToEmbed(guilds);
      const wbClient = new WebhookClient(wb.id, wb.token);
      wbClient.name = 'Oghmabot Online';
      wbClient.send('', embedOnline);
    }

    console.log(loggedInServersToString(guilds));
  });

  /**
   * Listen for messages and make sure the bot doesn't respond to itself
   * @ignore
   */
  bot.on('message', msg => {
    if (msg.author.id === bot.user.id) return;
  });
  bot.login(process.env.BOT_TOKEN);
  setInterval(Arelith.Update.checkForUpdate, 30 * 1000, bot);
  setInterval(Arelith.Status.updateServerStatus, 15 * 1000, bot);
}());
