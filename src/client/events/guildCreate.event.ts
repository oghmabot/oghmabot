import { Guild, MessageEmbed, TextChannel } from 'discord.js';
import { getOghmabotEmbed } from '../../utils';

const guildString = (guild: Guild): string => `${guild.name} (${guild.memberCount} members)`;

const joinedGuildToEmbed = (guild: Guild): MessageEmbed => {
  const embed = getOghmabotEmbed();
  embed.setTitle(guild.name);
  embed.setDescription('Joined server.');
  return embed;
};

export const handleGuildCreate = async (guild: Guild): Promise<void> => {
  const { BOT_STATUS_CHANNEL, IGNORE_GUILDS } = process.env;
  const { channels } = guild.client;

  if (BOT_STATUS_CHANNEL && !IGNORE_GUILDS?.includes(guild.id)) {
    const channel = await channels.fetch(BOT_STATUS_CHANNEL) as TextChannel | undefined;
    if (channel) {
      channel.send('', joinedGuildToEmbed(guild));
    }
    console.log(`Joined server: ${guildString(guild)}`);
  }
};
