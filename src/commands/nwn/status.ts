import { MessageEmbed } from 'discord.js';
import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';

import { Server, ServerModel, Status, StatusModel } from '../../data';
import { fetchServer } from '../../data/proxy/beamdog';
import { serverStatusToEmbed } from '../../utils';

export class StatusCommand extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: 'status',
      group: 'nwn',
      memberName: 'status',
      description: 'Replies with the current status of given server(s).',
      args: [
        {
          key: 'servers',
          prompt: 'N/A',
          type: 'string',
          default: '',
        },
      ],
    });
  }

  async run(msg: CommandoMessage, { servers }: { servers: string }): Promise<any> {
    const requestedServers = servers == ''
      ? await ServerModel.getServers()
      : await ServerModel.getServersFromStringParse(servers);

    if (requestedServers) {
      requestedServers.forEach(async server => {
        const status = await fetchServer(server.id, StatusModel);
        await msg.embed(this.createStatusEmbed(server, status));
      });
    }
  }

  createStatusEmbed = serverStatusToEmbed;
}
