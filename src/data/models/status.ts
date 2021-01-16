import { MessageEmbed } from "discord.js";
import { BeamdogAPIResponse } from "../proxy/beamdog";
import { Server } from "./server";

export interface Status {
  name: string;
  module: string;
  players: number;
  online: boolean;
  uptime: number;
  kx_pk: string;
}

export class StatusModel {
  static fromBeamdogAPIResponse = (response: BeamdogAPIResponse): Status => (
    {
      name: response.session_name,
      module: response.module_name,
      players: response.current_players,
      online: true,
      uptime: Math.abs(response.first_seen - response.last_advertisement) * 1000,
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
    : `**${state}** :disappointed: `
  );
  if (server.img) embed.setThumbnail(server.img);
  if (server.href) embed.setURL(server.href);
  return embed;
};
