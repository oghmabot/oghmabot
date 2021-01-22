import { TextChannel } from 'discord.js';
import { CommandoClient } from 'discord.js-commando';
import { Server, ServerModel, Status, StatusModel, SubscriptionModel } from './models';
import { BeamdogApiError, BeamdogApiProxy } from './proxies';
import { serverStatusToStatusUpdateEmbed } from '../utils';

export class StatusPoller {
  private client: CommandoClient;
  private status: Record<string, Status>;

  constructor(client: CommandoClient, interval: number = 10000) {
    this.client = client;
    this.status = {};
    setInterval(this.pollAndUpdate, interval);
  }
  
  pollAndUpdate = async (): Promise<void> => {
    console.log('[StatusPoller] Polling Beamdog for server status changes...');
    const servers = await ServerModel.getServers();
    for (const server of servers) {
      const newStatus = await this.resolveNewStatus(server);
      
      if (newStatus) {
        const { id } = server;
        
        const status = this.status[id];
        if (status && (status.online !== newStatus.online || status.passworded !== newStatus.passworded)) {
          console.log('[StatusPoller] Found new server status, posting to subscribers.');
          await this.notifySubscribers(server, newStatus);
        }
        
        this.status[id] = newStatus;
      }
    }
  }
  
  notifySubscribers = async (server: Server, status: Status): Promise<void> => {
    const messageEmbed = this.createStatusUpdateEmbed(server, status);
    const subscriptions = await SubscriptionModel.getSubscriptionsForServer(server.id);
    for (const sub of subscriptions) {
      const { channelId, autoDeleteMessages, lastMessageId } = sub;
      const channel = this.client.channels.cache.find(c => c.id === channelId) as TextChannel | undefined;
      
      if (channel) {
        if (autoDeleteMessages && lastMessageId) {
          try {
            channel.messages.delete(lastMessageId);
          } catch (error) {
            console.warn('[StatusPoller] Failed to delete last message.', error);
          }
        }

        const newMsg = await channel.send('', messageEmbed);
        SubscriptionModel.update({
          lastMessageId: newMsg.id,
        }, {
          where: sub,
        });
      }
    }
  }
  
  resolveNewStatus = async (server: Server): Promise<Status | undefined> => {
    try {
      return await BeamdogApiProxy.fetchServer(server.id, StatusModel);
    } catch (err) {
      if (err instanceof BeamdogApiError) {
        if (err.code === 400) {
          console.error('[StatusPoller] Attempted an invalid request against the Beamdog API.');
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
  }
  
  createStatusUpdateEmbed = serverStatusToStatusUpdateEmbed;
}
