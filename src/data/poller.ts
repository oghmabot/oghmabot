import { TextChannel } from 'discord.js';
import { CommandoClient } from 'discord.js-commando';
import { Server, ServerModel, Status, StatusModel, SubscriptionModel } from './models';
import { BeamdogApiError, BeamdogApiProxy } from './proxies';
import { serverStatusToStatusUpdateEmbed } from '../utils';

export class StatusPoller {
  private client: CommandoClient;
  private status: { [serverId: string]: Status } = {};

  constructor(client: CommandoClient, interval: number = 5000) {
    this.client = client;
    setInterval(this.pollAndUpdate, interval);
  }

  pollAndUpdate = async (): Promise<void> => {
    console.log('Polling Beamdog for server status changes...');
    const servers = await ServerModel.getServers();
    for (const server of servers) {
      const newStatus = await this.resolveNewStatus(server);

      if (newStatus) {
        const { id } = server;

        if (this.status[id] && this.status[id].online !== newStatus.online) {
          console.log('Found new server status, posting to subscribers.');
          this.notifySubscribers(server, newStatus);
        }

        this.status[id] = newStatus;
      }
    }
  }

  notifySubscribers = async (server: Server, status: Status): Promise<void> => {
    const messageEmbed = this.createStatusUpdateEmbed(server, status);
    for (const sub of await SubscriptionModel.getSubscriptionsForServer(server.id)) {
      const channel = this.client.channels.cache.find(c => c.id === sub.channel) as TextChannel;
      if (channel) {
        channel.send('', messageEmbed);
      }
    }
  }

  resolveNewStatus = async (server: Server): Promise<Status | null> => {
    try {
      return await BeamdogApiProxy.fetchServer(server.id, StatusModel);
    } catch (err) {
      if (err instanceof BeamdogApiError) {
        if (err.code === 400) {
          console.error('StatusPoller has attempted an invalid query against the Beamdog API.', err);
        }

        if (err.code === 404) {
          const { name, last_seen, kx_pk } = this.status[server.id];
          return {
            name: name || name,
            passworded: false,
            players: 0,
            online: false,
            uptime: 0,
            last_seen: last_seen,
            kx_pk: kx_pk || server.id,
          };
        }
      }
    }

    return null;
  }

  createStatusUpdateEmbed = serverStatusToStatusUpdateEmbed;
}
