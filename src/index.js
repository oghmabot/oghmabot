/**
 * Relative imports
 * @ignore
 */
const config = require('./config.json');
const { Arelith } = require('./assets');
const { loggedInServersToEmbed, loggedInServersToString } = require('./util');
const { CommandoClient } = require('discord.js-commando');
const dotenv = require('dotenv');
const path = require('path');

/**
 * Set environment variables from .env, if present
 * @ignore
 */
dotenv.config();

/**
 * Instantiating the bot/client
 * @ignore
 */
const client = new CommandoClient({
  owners: process.env.BOT_OWNERS,
  commandPrefix: config.prefix,
  disableEveryone: true,
  unknownCommandResponse: false,
});

client.registry
  .registerGroups([
    ['standard', 'Standard commands'],
    ['arelith', 'Commands related to Arelith'],
  ])
  .registerDefaults().registerCommandsIn(path.join(__dirname, 'commands'));


/**
 * When bot is ready, output logged in servers
 * @ignore
 */
client.on('ready', () => {
  const { guilds } = client;
  const { BOT_STATUS_SERVER, BOT_STATUS_CHANNEL } = process.env;

  if(BOT_STATUS_SERVER && BOT_STATUS_CHANNEL) {
    const statusServer = guilds.find(g => g.id == BOT_STATUS_SERVER);
    const channel = statusServer.channels.find(c => c.id == BOT_STATUS_CHANNEL);

    if (channel) {
      channel.send('', loggedInServersToEmbed(guilds));
    }
  }
  console.log(loggedInServersToString(guilds));
});

/**
 * Login to the Discord service
 * @ignore
 */
client.login(process.env.BOT_TOKEN);

/**
 * Set intervals
 * @ignore
 */
setInterval(() => Arelith.status.updateServerStatus(client), 60000);

const { Sequelize } = require('sequelize');

const sql = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: { ssl: { rejectUnauthorized: false }},
});

(async () => {
  const { initialize } = require('./db');
  await initialize(sql);
})();
