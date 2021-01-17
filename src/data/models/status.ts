import { MessageEmbed } from "discord.js";

import { BeamdogAPIResponseBody } from "../proxy/beamdog";
import { Server } from "./server";
import { calculateTimeBetween, convertMillisecondsToTimestamp } from "../../utils";

export interface Status {
  name: string;
  players: number;
  online: boolean;
  uptime: number;
  last_seen?: number;
  kx_pk: string;
}

export class StatusModel {
  static fromBeamdogAPIResponseBody = (response: BeamdogAPIResponseBody): Status => (
    {
      name: response.session_name,
      players: response.current_players,
      online: true,
      uptime: calculateTimeBetween(response.first_seen, response.last_advertisement),
      last_seen: response.last_advertisement,
      kx_pk: response.kx_pk,
    }
  );
}

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
