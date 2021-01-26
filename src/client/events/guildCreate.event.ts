import { Guild, MessageEmbed, TextChannel } from 'discord.js';
import { OghmabotEmbed } from '../oghmabot.embed';

const guildString = (guild: Guild): string => `${guild.name} (${guild.memberCount} members)`;

const joinedGuildToEmbed = (guild: Guild): MessageEmbed =>
  new OghmabotEmbed({
    title: guild.name,
    description: 'Joined server.',
  });

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
