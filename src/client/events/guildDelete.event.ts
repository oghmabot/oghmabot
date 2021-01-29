import { Guild, MessageEmbed, TextChannel } from 'discord.js';
import { purgeRefsToChannel } from '../../data/models';
import { OghmabotEmbed } from '../embeds';

const leftGuildToEmbed = (guild: Guild, purgedRows?: number): MessageEmbed =>
  new OghmabotEmbed({
    title: guild.name,
    description: purgedRows ? `Left server, purged ${purgedRows} database rows.` : 'Left server.',
  });

const purgeDbRefs = async (guild: Guild): Promise<number> => {
  let count = 0;
  for (const channel of guild.channels.cache.values()) {
    count += await purgeRefsToChannel(channel.id);
  }
  return count;
};

export const handleGuildDelete = async (guild: Guild): Promise<void> => {
  const { BOT_STATUS_CHANNEL, IGNORE_GUILDS } = process.env;
  const { channels } = guild.client;

  const purgedRows = await purgeDbRefs(guild);

  if (BOT_STATUS_CHANNEL && !IGNORE_GUILDS?.includes(guild.id)) {
    const channel = await channels.fetch(BOT_STATUS_CHANNEL) as TextChannel | undefined;
    if (channel) {
      channel.send('', leftGuildToEmbed(guild, purgedRows));
    }
    console.log(`Left server: ${guild.name}`);
  }
};
