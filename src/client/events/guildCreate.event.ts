import { Guild, MessageEmbed, TextChannel } from 'discord.js';
import { getOghmabotEmbed } from '../../utils';

const guildString = (guild: Guild): string => `${guild.name} (${guild.memberCount} members)`;

const joinedGuildToEmbed = (guild: Guild): MessageEmbed => {
  const embed = getOghmabotEmbed();
  embed.setTitle('Joined Server');
  embed.setDescription(guildString(guild));
  return embed;
};

export const handleGuildCreate = async (guild: Guild): Promise<void> => {
  const { BOT_STATUS_CHANNEL, IGNORE_GUILDS } = process.env;
  const { channels } = guild.client;

  if (BOT_STATUS_CHANNEL && !IGNORE_GUILDS?.includes(guild.id)) {
    const channel = channels.cache.find(c => c.id === BOT_STATUS_CHANNEL) as TextChannel | undefined;
    if (channel) {
      channel.send('', joinedGuildToEmbed(guild));
    }
  }
  console.log(`Joined server: ${guildString(guild)}`);
};
