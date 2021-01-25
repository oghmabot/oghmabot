import { Message } from 'discord.js';
import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';
import { Server, ServerModel, SubscriptionModel, SubscriptionType } from '../../data/models';

export class UnsubscribeCommand extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: 'unsubscribe',
      group: 'nwn',
      memberName: 'unsubscribe',
      description: 'Unsubscribe to server status updates in current channel.',
      userPermissions: ['MANAGE_CHANNELS'],
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

  async run(msg: CommandoMessage, { servers }: { servers: string }): Promise<Message | null> {
    try {
      const requestedServers = servers === ''
        ? await ServerModel.getServers()
        : await ServerModel.getServersFromStringParse(servers);

      return requestedServers.length === 0
        ? await msg.say('Input doesn\'t match any known servers.')
        : await this.unsubscribe(msg, requestedServers);
    } catch (error) {
      console.error(error);
    }

    return null;
  }
  async unsubscribe(msg: CommandoMessage, servers: Server[]): Promise<Message> {
    const removed: string[] = [];
    for (const server of servers) {
      const subscription = {
        type: SubscriptionType.Status,
        channelId: msg.channel.id,
        subscribedTo: server.id,
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
