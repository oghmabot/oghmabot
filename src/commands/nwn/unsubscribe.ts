import { Message } from 'discord.js';
import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';

import { Server, ServerModel, SubscriptionModel } from '../../data';

export class UnsubscribeCommand extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: 'unsubscribe',
      group: 'nwn',
      memberName: 'unsubscribe',
      description: 'Unsubscribe to server status updates in current channel.',
      userPermissions: ['MANAGE_GUILD'],
      args: [
        {
          key: 'servers',
          prompt: 'Specify servers to unsubscribe to (default is all).',
          type: 'string',
          default: '',
        },
      ],
    });
  }

  async run(msg: CommandoMessage, { servers }: { servers: string }): Promise<any> {
    const requestedServers = servers === ''
      ? await ServerModel.getAllServers()
      : await ServerModel.getServersFromStringParse(servers);

    return requestedServers.length === 0
      ? await msg.say(`Input doesn't match any known servers.`)
      : await this.unsubscribe(msg, requestedServers);
  }
  async unsubscribe(msg: CommandoMessage, servers: Server[]): Promise<Message | CommandoMessage> {
    const removed: string[] = [];
    for (const server of servers) {
      const subscription = {
        channel: msg.channel.id,
        server: server.id,
      };

      if (await SubscriptionModel.subscriptionExists(subscription)) {
        await SubscriptionModel.destroy({ where: subscription });
        removed.push(server.name);
      }
    }

    return removed.length > 0
      ? msg.say(`Unsubscribed to status updates for: ${removed.join(', ')}`)
      : msg.say('No status updates subscribed to.');
  }
}