import { TextChannel } from "discord.js";
import { CommandoClient } from "discord.js-commando";

import { ServerModel, serverStatusToEmbed, Status, StatusModel, SubscriptionModel } from "./models";
import { fetchServer } from "./proxy";

export class StatusPoller {
  private client: CommandoClient;
  private status: { [serverId: string]: Status } = {};

  constructor(client: CommandoClient, interval: number = 60000) {
    this.client = client;
    setInterval(this.pollAndUpdate, interval);
  }

  pollAndUpdate = async (): Promise<void> => {
    console.log('Polling Beamdog for server status changes...');
    const servers = await ServerModel.getAllServers();
    for (const server of servers) {
      const { id } = server;
      const currentStatus = StatusModel.fromBeamdogAPIResponseBody(await fetchServer(id));

      if (this.status[id] && this.status[id].online !== currentStatus.online) {
        console.log('Found new server status, posting to subscribers.');

        const messageEmbed = serverStatusToEmbed(server, currentStatus);
        const subscriptions = await SubscriptionModel.getSubscriptionsForServer(id);

        for (const sub of subscriptions) {
          const channel = this.client.channels.cache.find(c => c.id === sub.channel) as TextChannel;
          if (channel) {
            channel.send('', messageEmbed);
          }
        }
      }

      this.status[id] = currentStatus;
    }
  }
}
