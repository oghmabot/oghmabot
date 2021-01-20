import { Collection, Guild, MessageEmbed } from 'discord.js';
import { convertMillisecondsToTimestamp, calculateTimeBetween, nowUnixTime } from './time';
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
  const embed = getOghmabotEmbed();
  embed.setTimestamp();
  embed.setTitle(server.name);
  embed.setColor(status.online ? 0x00ff00 : 0xffcc00);
  embed.setDescription(status.online
    ? `**${state}** :hourglass: ${new Date(status.uptime).toISOString().substr(11, 8)} :busts_in_silhouette: ${status.players}`
    : `**${state}** :disappointed: ${status.last_seen && convertMillisecondsToTimestamp(calculateTimeBetween(status.last_seen, nowUnixTime()))}`,
  );
  if (server.img) embed.setThumbnail(server.img);
  if (server.href) embed.setURL(server.href);
  return embed;
};

export const getOghmabotEmbed = (timestamp: boolean = true, icon: boolean = true): MessageEmbed => {
  const { OGHMABOT_ICON_URL } = process.env;
  const embed = new MessageEmbed();
  if (timestamp) embed.setTimestamp();
  if (icon && OGHMABOT_ICON_URL) embed.setFooter('Oghmabot', OGHMABOT_ICON_URL);
  return embed;
};
