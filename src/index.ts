import { TextChannel } from "discord.js";
import { CommandoClient } from 'discord.js-commando';
import dotenv from 'dotenv';

import { loggedInServersToEmbed, loggedInServersToString } from './util';
import { AddCommand,  InitializeCommand, RollCommand, StatusCommand } from "./commands";
import { connect } from './data';

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
} = process.env;

const client = new CommandoClient({
  owner: BOT_OWNER,
  commandPrefix: BOT_PREFIX || '-',
});

client.registry
  .registerGroups([
    ['owner', 'Commands usable only by the bot owner.'],
    ['standard', 'Standard commands.'],
  ])
  .registerDefaults()
  .registerCommands([AddCommand, InitializeCommand, RollCommand, StatusCommand]);

/**
 * When bot is ready, output logged in servers
 * @ignore
 */
client.on('ready', async () => {
  const { channels, guilds } = client;

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
client.login(BOT_TOKEN);
