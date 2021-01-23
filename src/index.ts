import { TextChannel } from 'discord.js';
import dotenv from 'dotenv';
import { OghmabotClient } from './client';
import { connect } from './data';
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

const client = new OghmabotClient({
  owner: BOT_OWNER,
  commandPrefix: BOT_PREFIX || '-',
});

client.on('ready', async () => {
  const { channels, guilds } = client;
  const guildsToList = guilds.cache.filter(g => !IGNORE_SERVERS?.includes(g.id));

  await connect(DATABASE_URL);

  if (BOT_STATUS_CHANNEL) {
    const channel = channels.cache.find(c => c.id === BOT_STATUS_CHANNEL) as TextChannel | undefined;

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
