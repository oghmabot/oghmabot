import { TextChannel } from "discord.js";
import { CommandoClient } from 'discord.js-commando';
import dotenv from 'dotenv';

import { Arelith } from './assets';
import { loggedInServersToEmbed, loggedInServersToString } from './util';
import { RollCommand, StatusCommand } from "./commands";
import { connect } from './db';

/**
 * Set environment variables from .env, if present
 * @ignore
 */
dotenv.config();

const { BOT_OWNER, BOT_PREFIX } = process.env;
const client = new CommandoClient({
  owner: BOT_OWNER,
  commandPrefix: BOT_PREFIX || '-',
});

client.registry
  .registerGroups([
    ['standard', 'Standard commands'],
    ['arelith', 'Commands related to Arelith'],
  ])
  .registerDefaults()
  .registerCommands([RollCommand, StatusCommand]);


/**
 * When bot is ready, output logged in servers
 * @ignore
 */
client.on('ready', async () => {
  const { channels, guilds } = client;
  const { BOT_STATUS_CHANNEL, DATABASE_URL } = process.env;

  if (!DATABASE_URL) throw new Error('Database URL missing.');
  await connect(DATABASE_URL);

  if (BOT_STATUS_CHANNEL) {
    const channel = channels.cache.find(c => c.id === BOT_STATUS_CHANNEL) as TextChannel;

    if (channel) {
      channel.send('', loggedInServersToEmbed(guilds.cache));
    }
  }
  console.log(loggedInServersToString(guilds.cache));
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
