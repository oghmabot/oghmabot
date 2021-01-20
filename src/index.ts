import { TextChannel } from 'discord.js';
import { CommandoClient } from 'discord.js-commando';
import dotenv from 'dotenv';

import { getAllCommands } from './commands';
import { connect, StatusPoller } from './data';
import { loggedInServersToEmbed, loggedInServersToString } from './utils';

/**
 * Set environment variables from .env, if present
 * @ignore
 */
dotenv.config();

const {
  BOT_OWNER,
  BOT_PREFIX,
  BOT_STATUS_CHANNEL,
  BOT_TOKEN,
  DATABASE_URL,
  IGNORE_SERVERS,
} = process.env;

const client = new CommandoClient({
  owner: BOT_OWNER,
  commandPrefix: BOT_PREFIX || '-',
});

client.registry
  .registerGroups([
    ['owner', 'Owner'],
    ['standard', 'Standard'],
    ['nwn', 'Neverwinter Nights'],
  ])
  .registerDefaults()
  .registerCommands(getAllCommands());

/**
 * When bot is ready, output logged in servers
 * @ignore
 */
client.on('ready', async () => {
  const { channels, guilds } = client;
  const guildsToList = guilds.cache.filter(g => !IGNORE_SERVERS?.includes(g.id));

  await connect(DATABASE_URL);

  if (BOT_STATUS_CHANNEL) {
    const channel = channels.cache.find(c => c.id === BOT_STATUS_CHANNEL) as TextChannel;

    if (channel) {
      channel.send('', loggedInServersToEmbed(guildsToList));
    }
  }
  console.log(loggedInServersToString(guildsToList));
});

/**
 * Login to the Discord service
 * @ignore
 */
client.login(BOT_TOKEN);

new StatusPoller(client);
