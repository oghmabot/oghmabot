import { Message } from 'discord.js';
import { Command, CommandoMessage } from 'discord.js-commando';
import { OghmabotClient } from '../../client';
import { SequelizeProvider } from '../../client/settings';
import { MessageExpiryModel, ServerModel, StatusPoller } from '../../data/models';
import { serverStatusToEmbed } from '../../utils';

export class StatusCommand extends Command {
  private poller: StatusPoller;

  constructor(client: OghmabotClient) {
    super(client, {
      name: 'status',
      group: 'server',
      memberName: 'status',
      description: 'Replies with the current status of given Arelith server(s).',
      details: 'The command will respond with the last known status of known NWN servers. If no inline argument is provided with the command, all known servers are returned.',
      args: [
        {
          key: 'servers',
          prompt: 'Specify which NWN server(s) to output the current status of (default is all).',
          type: 'string',
          default: '',
        },
      ],
      throttling: {
        duration: 10,
        usages: 2,
      },
      examples: [
        '-status',
        '-status surface',
        '-status ud cp',
      ],
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
        const status = await this.poller.fetch(server.id);
        if (status) {
          const embedMsg = await msg.embed(this.createStatusEmbed(server, status));
          await this.setToExpire(embedMsg);
        }
      });
    } catch (error) {
      console.error('[StatusCommand] Unexpected error.', error);
    }

    return null;
  }

  createStatusEmbed = serverStatusToEmbed;

  private async setToExpire(msg: CommandoMessage): Promise<void> {
    const provider = this.client.provider as SequelizeProvider;
    const expiry = provider.getForChannel(msg.channel, `expire-${this.name}`) ?? provider.get(msg.guild, 'expire-all');
    if (expiry && typeof expiry === 'number') await MessageExpiryModel.setExpiry(msg, new Date(Date.now() + expiry));
  }
}
