import { Message } from 'discord.js';
import { Command, CommandoMessage } from 'discord.js-commando';
import { OghmabotClient } from '../../client';
import { ServerModel, StatusPoller } from '../../data/models';
import { serverStatusToEmbed } from '../../utils';

export class StatusCommand extends Command {
  private poller: StatusPoller;

  constructor(client: OghmabotClient) {
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
      throttling: {
        duration: 10,
        usages: 2,
      },
    });

    this.poller = client.pollers.get('status') as StatusPoller;
  }

  async run(msg: CommandoMessage, { servers }: { servers: string }): Promise<Message | null> {
    try {
      const requestedServers = !servers
        ? await ServerModel.getServers()
        : await ServerModel.getServersFromStringParse(servers);
      if (!requestedServers?.length) msg.say('Server not found.');

      requestedServers.forEach(async server => {
        const status = await this.poller.getOrFetch(server.id);
        if (status) await msg.embed(this.createStatusEmbed(server, status));
      });
    } catch (error) {
      console.error('[StatusCommand] Unexpected error.', error);
    }

    return null;
  }

  createStatusEmbed = serverStatusToEmbed;
}
