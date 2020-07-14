'use strict';

const scripts = require('./scripts.js');

// Importing installed and default packages provided by npm
const { CommandoClient } = require('discord.js-commando');
const path = require('path');
const assets = require('./assets/index')
const update = assets.Arelith.Update;
const serverStatus = assets.Arelith.Status;

// This module is here defined as a function that takes a single parameter "config"
module.exports = (config) => {
  // Instantiating the bot/client, some settings in curly brackets
  const bot = new CommandoClient({
    owners: process.env.BOT_OWNERS,
    commandPrefix: config.prefix,
    disableEveryone: true,
    unknownCommandResponse: false
  });

  bot.assets = assets;
  bot.defaultSettings = {
    announcementsState: false,
    statusState: false
  }

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
    scripts.run(bot);
    bot.login(process.env.BOT_TOKEN);
    setInterval(update.checkForUpdate, 30 * 1000, bot);
    setInterval(serverStatus.updateServerStatus, 15 * 1000, bot);
  }());
}
