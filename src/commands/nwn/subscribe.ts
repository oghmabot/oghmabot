import { Message } from 'discord.js';
import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';
import { Server, ServerModel, SubscriptionModel } from '../../data/models';

export class SubscribeCommand extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: 'subscribe',
      group: 'nwn',
      memberName: 'subscribe',
      description: 'Subscribe to server status updates in current channel.',
      userPermissions: ['MANAGE_CHANNELS'],
      args: [
        {
          key: 'servers',
          prompt: 'Specify servers to subscribe to (default is all).',
          type: 'string',
          default: '',
        },
      ],
    });
  }

  async run(msg: CommandoMessage, { servers }: { servers: string }): Promise<any> {
    const requestedServers = servers === ''
      ? await ServerModel.getServers()
      : await ServerModel.getServersFromStringParse(servers);

    return requestedServers.length === 0
      ? await msg.say(`Input doesn't match any known servers.`)
      : await this.subscribe(msg, requestedServers);
  }

  async subscribe(msg: CommandoMessage, servers: Server[]): Promise<Message | CommandoMessage> {
    const added: string[] = [];
    for (const server of servers) {
      const subscription = {
        channel: msg.channel.id,
        server: server.id,
        createdBy: msg.author.id,
      };

      try {
        if (await SubscriptionModel.subscriptionExists(subscription)) {
          console.warn('Subscription already exists:', subscription);
        } else {
          await SubscriptionModel.addSubscription(subscription);
          added.push(server.name);
        }
      } catch (err) {
        console.warn('Failed to register new subscription:', subscription);
      }
    }

    return added.length > 0
      ? msg.say(`Status updates will be posted in this channel for: ${added.join(', ')}`)
      : msg.say('Status updates already subscribed to.');
  }
}