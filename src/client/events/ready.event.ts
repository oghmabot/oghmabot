import { TextChannel } from 'discord.js';
import { CommandoClient } from 'discord.js-commando';
import { connect } from '../../data';
import { loggedInServersToEmbed, loggedInServersToString } from '../../utils';

export const handleClientReady = async (client: CommandoClient): Promise<void> => {
  const { BOT_STATUS_CHANNEL, DATABASE_URL, IGNORE_SERVERS } = process.env;
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
};
