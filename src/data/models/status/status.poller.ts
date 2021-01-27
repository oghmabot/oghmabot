import { TextChannel } from 'discord.js';
import { CommandoClient } from 'discord.js-commando';
import { Server, ServerModel, Status, StatusModel, SubscriptionModel } from '..';
import { BeamdogApiError, BeamdogApiProxy } from '../../proxies';
import { serverStatusToStatusUpdateEmbed } from '../../../utils';
import { BasePoller } from '../../common';

export class StatusPoller extends BasePoller<Status> {
  constructor(client: CommandoClient, interval: number = 10000) {
    super(client, interval);
    this.activatePolling();
  }

  getOrFetch = async (serverId: string): Promise<Status | undefined> => this.cache.get(serverId) ?? await BeamdogApiProxy.fetchServer(serverId, StatusModel);

  protected pollAndUpdate = async (): Promise<void> => {
    console.log('[StatusPoller] Polling Beamdog for server status changes...');
    const servers = await ServerModel.getServers();
    for (const server of servers) {
      const newStatus = await this.resolveNewStatus(server);

      if (newStatus) {
        const { id } = server;

        const status = this.cache.get(id);
        if (status && this.shouldNotify(status, newStatus)) {
          console.log('[StatusPoller] Found new server status, posting to subscribers.');
          await this.notifySubscribers(server, newStatus);
        }

        this.cache.set(id, newStatus);
      }
    }
  }

  private notifySubscribers = async (server: Server, status: Status): Promise<void> => {
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

  protected shouldNotify = (prevStatus: Status, newStatus: Status): boolean => {
    const pState = StatusModel.resolveStatusAsDescriptor(prevStatus);
    const nState = StatusModel.resolveStatusAsDescriptor(newStatus);

    return pState < nState;
  }

  protected resolveNewStatus = async (server: Server): Promise<Status | undefined> => {
    try {
      return await BeamdogApiProxy.fetchServer(server.id, StatusModel);
    } catch (err) {
      if (err instanceof BeamdogApiError) {
        if (err.code === 400) {
          console.error('[StatusPoller] Attempted an invalid request against the Beamdog API.');
        }

        if (err.code === 404) {
          const { name, lastSeen, serverId } = this.cache.get(server.id) || {};
          return {
            name: name || server.name,
            passworded: false,
            players: 0,
            online: false,
            uptime: 0,
            lastSeen: lastSeen,
            serverId: serverId || server.id,
          };
        }
      }
    }
  }

  protected createStatusUpdateEmbed = serverStatusToStatusUpdateEmbed;
}
