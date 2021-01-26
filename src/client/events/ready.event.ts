import { Collection, Guild, MessageEmbed, TextChannel } from 'discord.js';
import { CommandoClient } from 'discord.js-commando';
import { connect } from '../../data';
import { getOghmabotEmbed } from '../../utils';

const loggedInServersToString = (servers: Collection<string, Guild>): string =>
  `Logged in to servers: ${servers.map(g => g.name).join(', ')}`;

const loggedInServersToEmbed = (servers: Collection<string, Guild>): MessageEmbed => {
  const embed = getOghmabotEmbed();
  embed.setColor(0x00ff00);
  embed.setTitle('Oghmabot Online');
  embed.setDescription(loggedInServersToString(servers));
  return embed;
};

export const handleClientReady = async (client: CommandoClient): Promise<void> => {
  const { BOT_STATUS_CHANNEL, DATABASE_URL, IGNORE_GUILDS } = process.env;
  const { channels, guilds } = client;
  const guildsToList = guilds.cache.filter(g => !IGNORE_GUILDS?.includes(g.id));

  await connect(DATABASE_URL);

  if (BOT_STATUS_CHANNEL) {
    const channel = await channels.fetch(BOT_STATUS_CHANNEL) as TextChannel | undefined;
    if (channel) {
      channel.send('', loggedInServersToEmbed(guildsToList));
    }
  }
  console.log(loggedInServersToString(guildsToList));
};
