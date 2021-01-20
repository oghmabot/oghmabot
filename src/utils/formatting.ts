import { Collection, Guild, MessageEmbed } from 'discord.js';
import { convertMillisecondsToTimestamp, calculateTimeBetween, nowUnixTime } from './time';
import { Server, Status, StatusColors } from '../data/models';

export const getOghmabotEmbed = (timestamp: boolean = true, icon: boolean = true): MessageEmbed => {
  const { OGHMABOT_ICON_URL } = process.env;
  const embed = new MessageEmbed();
  if (timestamp) embed.setTimestamp();
  if (icon && OGHMABOT_ICON_URL) embed.setFooter('Oghmabot', OGHMABOT_ICON_URL);
  return embed;
};

export const loggedInServersToEmbed = (servers: Collection<string, Guild>): MessageEmbed => {
  const embed = getOghmabotEmbed();
  embed.setColor(0x00ff00);
  embed.setTitle('Oghmabot Online');
  embed.setDescription(loggedInServersToString(servers));
  return embed;
};

export const loggedInServersToString = (servers: Collection<string, Guild>): string =>
  `Logged in to servers: ${servers.map(g => g.name).join(', ')}`;

export const serverStatusToEmbed = (server: Server, status: Status): MessageEmbed => {
  const state = status.online ? status.passworded ? 'Stabilizing' : 'Online' : 'Offline';
  const embed = getOghmabotEmbed();
  embed.setTimestamp();
  embed.setTitle(server.name);
  embed.setColor(StatusColors[state.toLowerCase()]);
  embed.setDescription(status.online
    ? `**${state}** :hourglass: ${new Date(status.uptime).toISOString().substr(11, 8)} :busts_in_silhouette: ${status.players}`
    : `**${state}** :hourglass: ${status.last_seen && convertMillisecondsToTimestamp(calculateTimeBetween(status.last_seen, nowUnixTime()))}`,
  );
  if (server.img) embed.setThumbnail(server.img);
  if (server.href) embed.setURL(server.href);
  return embed;
};

export const serverStatusToStatusUpdateEmbed = (server: Server, status: Status): MessageEmbed => {
  const state = status.online ? status.passworded ? 'restarting' : 'online' : 'offline';
  const embed = getOghmabotEmbed();
  embed.setTitle(`${server.name} is now ${state}.`);
  embed.setColor(StatusColors[state]);
  if (server.img) embed.setThumbnail(server.img);
  return embed;
};
