import { Channel, Message, TextChannel } from 'discord.js';
import { CommandoClient } from 'discord.js-commando';
import { Server, ServerModel, Status, StatusModel, SubscriptionModel } from './models';
import { BeamdogApiError, BeamdogApiProxy } from './proxies';
import { serverStatusToStatusUpdateEmbed } from '../utils';

type StatusMemory = Record<string, { status: Status; messages: Message[]; }>;

export class StatusPoller {
  private client: CommandoClient;
  private status: StatusMemory = {};

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
        if (!this.status[id]) this.status[id] = { status: newStatus, messages: [] };

        const { status } = this.status[id];
        if (status && status.online !== newStatus.online) {
          console.log('Found new server status, posting to subscribers.');
          this.status[id].messages = await this.notifySubscribers(server, newStatus);
        }

        this.status[id].status = newStatus;
      }
    }
  }

  notifySubscribers = async (server: Server, status: Status): Promise<Message[]> => {
    const messageEmbed = this.createStatusUpdateEmbed(server, status);
    const subscriptions = await SubscriptionModel.getSubscriptionsForServer(server.id);
    return Promise.all(subscriptions.flatMap(sub => {
      const channel = this.client.channels.cache.find(c => c.id === sub.channel) as TextChannel;

      if (channel) {
        this.deletePreviousMessage(server, channel);
        return channel.send('', messageEmbed);
      }

      return [];
    }));
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
          const { name, last_seen, kx_pk } = this.status[server.id].status;
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

  deletePreviousMessage = async (server: Server, channel: Channel): Promise<void> => {
    const { messages } = this.status[server.id];
    const prevMsg = messages.find(msg => msg.channel.id === channel.id);
    if (prevMsg && new Date().getTime() - prevMsg.createdTimestamp < 300000) prevMsg.delete();
  }

  createStatusUpdateEmbed = serverStatusToStatusUpdateEmbed;
}
