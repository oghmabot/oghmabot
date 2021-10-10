import { MessageEmbed } from 'discord.js';
import { convertMillisecondsToTimestamp, calculateTimeBetween, nowUnixTime } from './time';
import { Server, Status, StatusColors } from '../data/models';
import { OghmabotEmbed } from '../client';

export const serverStatusToEmbed = (server: Server, status: Status): MessageEmbed => {
  const embed = new OghmabotEmbed();
  const state = status.online ? status.passworded ? 'Stabilizing' : 'Online' : 'Offline';
  embed.setTitle(server.name);
  embed.setColor(StatusColors[state.toLowerCase()]);
  embed.setDescription(status.online
    ? `**${state}** :hourglass: ${convertMillisecondsToTimestamp(status.uptime)} :busts_in_silhouette: ${status.players}`
    : `**${state}** :hourglass: ${status.lastSeen && convertMillisecondsToTimestamp(calculateTimeBetween(status.lastSeen, nowUnixTime()))}`,
  );
  if (server.img) embed.setThumbnail(server.img);
  if (server.href) embed.setURL(server.href);
  return embed;
};

export const serverStatusToStatusUpdateEmbed = (server: Server, status: Status): MessageEmbed => {
  const embed = new OghmabotEmbed();
  const { name } = server;
  const { online, passworded, restartSignalled } = status;

  if (restartSignalled) {
    embed.setTitle(`${name} - Restart Signalled`);
    embed.setColor(StatusColors.restartSignalled);
  } else {
    const state = online ? passworded ? 'restarting' : 'online' : 'offline';
    embed.setTitle(`${server.name} is now ${state}.`);
    embed.setColor(StatusColors[state]);
  }

  if (server.img) embed.setThumbnail(server.img);
  return embed;
};
