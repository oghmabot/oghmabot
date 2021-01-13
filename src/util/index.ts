import { Collection, Guild, MessageEmbed } from 'discord.js';

export const loggedInServersToEmbed = (servers: Collection<string, Guild>): MessageEmbed => {
  const embed = new MessageEmbed();
  embed.setColor(0x00ff00);
  embed.setTitle('Oghmabot Online');
  embed.setDescription(loggedInServersToString(servers));
  return embed;
};

export const loggedInServersToString = (servers: Collection<string, Guild>): string =>
  `Logged in to servers: ${servers.map(g => g.name).join(', ')}`;
