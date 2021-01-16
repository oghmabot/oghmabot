import { MessageEmbed } from "discord.js";
import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";

import { Server, ServerModel, Status, serverStatusToEmbed, StatusModel } from '../../data';
import { fetchServer } from '../../data/proxy/beamdog';

export class StatusCommand extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: 'status',
      group: 'standard',
      memberName: 'status',
      description: 'Replies with the current status of given server(s).',
      args: [
        {
          key: 'servers',
          prompt: 'N/A',
          type: 'string',
          default: '',
        }
      ]
    });
  }

  async run(msg: CommandoMessage, { servers }: { servers: string }): Promise<any> {
    const requestedServers = await ServerModel.getServersFromStringParse(servers);
    if (requestedServers) {
      requestedServers.forEach(async server => {
        const status = StatusModel.fromBeamdogAPIResponse(await fetchServer(server.id));
        await msg.embed(this.createStatusEmbed(server, status));
      });
    }
  }

  createStatusEmbed = (server: Server, status: Status): MessageEmbed => serverStatusToEmbed(server, status);
}
