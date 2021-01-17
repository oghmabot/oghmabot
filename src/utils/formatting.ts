import { Collection, Guild, MessageEmbed } from 'discord.js';
import { convertMillisecondsToTimestamp, calculateTimeBetween } from './time';
import { Server, Status } from '../data';

export const loggedInServersToEmbed = (servers: Collection<string, Guild>): MessageEmbed => {
  const embed = new MessageEmbed();
  embed.setColor(0x00ff00);
  embed.setTitle('Oghmabot Online');
  embed.setDescription(loggedInServersToString(servers));
  return embed;
};

export const loggedInServersToString = (servers: Collection<string, Guild>): string =>
  `Logged in to servers: ${servers.map(g => g.name).join(', ')}`;

export const serverStatusToEmbed = (server: Server, status: Status): MessageEmbed => {
  const state = status.online ? 'Online' : 'Offline';
  const embed = new MessageEmbed();
  embed.setTimestamp();
  embed.setTitle(server.name);
  embed.setColor(status.online ? 0x00ff00 : 0xffcc00);
  embed.setDescription(status.online
    ? `**${state}** :hourglass: ${new Date(status.uptime).toISOString().substr(11, 8)} :busts_in_silhouette: ${status.players}`
    : `**${state}** :disappointed: ${status.last_seen && convertMillisecondsToTimestamp(calculateTimeBetween(status.last_seen, new Date().getMilliseconds()))}`,
  );
  if (server.img) embed.setThumbnail(server.img);
  if (server.href) embed.setURL(server.href);
  return embed;
};
