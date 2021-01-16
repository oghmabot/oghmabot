import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { ServerModel, SubscriptionModel } from "../../data";

export class SubscribeCommand extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: 'subscribe',
      group: 'standard',
      memberName: 'subscribe',
      description: 'Subscribe to server status updates in a specific channel.',
      userPermissions: ['MANAGE_GUILD'],
      args: [
        {
          key: 'servers',
          prompt: 'Specify which servers to subscribe to (default is all).',
          type: 'string',
          default: '',
        },
      ],
    });
  }

  async run(msg: CommandoMessage, { servers }: { servers: string }): Promise<any> {
    const added: { [key: string]: boolean } = {};
    const requestedServers = await ServerModel.getServersFromStringParse(servers);
    if (requestedServers) {
      try {
        requestedServers.forEach(async server => {
          const subscription = {
            channel: msg.channel.id,
            server: server.id,
          };
          await SubscriptionModel.addSubscription(subscription);
          added[server.name] = true;
        });
      } catch (err) {
        console.warn(err.message);
      }
    }

    return added
      ? msg.reply(`Server status updates will be updated here for: ${Object.keys(added).join(', ')}.`)
      : msg.reply('Server status subscription failed.');
  }
}