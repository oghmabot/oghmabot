import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';
import { ServerModel, StatusModel } from '../../data/models';
import { fetchServer } from '../../data/proxies';
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
    try {
      const requestedServers = !servers
        ? await ServerModel.getServers()
        : await ServerModel.getServersFromStringParse(servers);
      if (!requestedServers?.length) msg.say('Server not found.');

      requestedServers.forEach(async server => {
        const status = await fetchServer(server.id, StatusModel);
        await msg.embed(this.createStatusEmbed(server, status));
      });
    } catch (error) {
      console.error(error);
    }
  }

  createStatusEmbed = serverStatusToEmbed;
}
