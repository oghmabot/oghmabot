'use strict';

const scripts = require('./scripts.js');

// Importing installed and default packages provided by npm
const {CommandoClient} = require('discord.js-commando');
const path = require('path');
const Enmap = require('enmap');
const EnmapMongo = require('enmap-mongo');
const assets = require('./assets/index')
const update = assets.Arelith.Update;
const serverStatus = assets.Arelith.Status;

// This module is here defined as a function that takes a single parameter "config"
module.exports = (config) => {
  // Instantiating the bot/client, some settings in curly brackets
  const bot = new CommandoClient({
    owners: config._BOT_OWNERS,
    commandPrefix: '-',
    disableEveryone: true,
    unknownCommandResponse: false
  });

  bot.assets = assets;


  //creating the guild/server based map that will be used to configure settings
  bot.settings = new Enmap({ provider: new EnmapMongo ({ name: 'settings', dbName: config._MONGODB_ENMAPDB, url: `mongodb://${config._MONGODB_USER}:${config._MONGODB_PASSWORD}@oghmacluster-shard-00-00-vqfed.mongodb.net:27017,oghmacluster-shard-00-01-vqfed.mongodb.net:27017,oghmacluster-shard-00-02-vqfed.mongodb.net:27017/${config._MONGODB_ENMAPDB}?ssl=true&replicaSet=OghmaCluster-shard-0&authSource=admin&retryWrites=true`})});
  bot.updates = new Enmap({ provider: new EnmapMongo ({ name: 'updates', dbName: config._MONGODB_ENMAPDB, url: `mongodb://${config._MONGODB_USER}:${config._MONGODB_PASSWORD}@oghmacluster-shard-00-00-vqfed.mongodb.net:27017,oghmacluster-shard-00-01-vqfed.mongodb.net:27017,oghmacluster-shard-00-02-vqfed.mongodb.net:27017/${config._MONGODB_ENMAPDB}?ssl=true&replicaSet=OghmaCluster-shard-0&authSource=admin&retryWrites=true`})});
  bot.servers = new Enmap({ provider: new EnmapMongo ({ name: 'servers', dbName: config._MONGODB_ENMAPDB, url: `mongodb://${config._MONGODB_USER}:${config._MONGODB_PASSWORD}@oghmacluster-shard-00-00-vqfed.mongodb.net:27017,oghmacluster-shard-00-01-vqfed.mongodb.net:27017,oghmacluster-shard-00-02-vqfed.mongodb.net:27017/${config._MONGODB_ENMAPDB}?ssl=true&replicaSet=OghmaCluster-shard-0&authSource=admin&retryWrites=true`})});

  bot.defaultSettings = {
      announcementsState: false,
      statusState: false
  }

  bot.mode = config._MONGODB_ENMAPDB.replace(/.*-/,'');

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
    .registerDefaultCommands({ping: false, prefix: false, commandState: false})
    .registerCommandsIn(path.join(__dirname, 'commands'));

  (async function () {
      await bot.settings.defer;
      await bot.updates.defer;
      await bot.servers.defer;
      scripts.run(bot);
      bot.login(config._BOT_TOKEN);
      setInterval(update.checkForUpdate,30*1000,bot);
      setInterval(serverStatus.updateServerStatus, 15*1000, bot);
  }());
}
