/**
 * Relative imports
 * @ignore
 */
const config = require('./config.json');
const { loggedInServersToEmbed, loggedInServersToString } = require('./util');

/**
 * Package imports
 * @ignore
 */
const dotenv = require('dotenv');
const path = require('path');

/**
 * Discord.js
 * @ignore
 */
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
const client = new CommandoClient({
  owners: process.env.BOT_OWNERS,
  commandPrefix: config.prefix,
  disableEveryone: true,
  unknownCommandResponse: false
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
