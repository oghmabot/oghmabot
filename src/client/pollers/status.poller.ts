import { DiscordAPIError, HTTPError, TextChannel } from 'discord.js';
import { CommandoClient } from 'discord.js-commando';
import { Server, ServerModel, Status, StatusModel, SubscriptionModel } from '../../data/models';
import { BeamdogApiError, BeamdogApiProxy } from '../../data/proxies';
import { serverStatusToStatusUpdateEmbed } from '../../utils';
import { BasePoller } from './base.poller';

export class StatusPoller extends BasePoller<Status> {
  constructor(client: CommandoClient, interval: number = 10000) {
    super(client, interval);
    this.activatePolling();
  }

  public async fetch(serverId: string): Promise<Status | undefined> {
    return this.cache.get(serverId) ?? await BeamdogApiProxy.fetchServer(serverId, StatusModel);
  }

  public signalRestart = async (serverId: string): Promise<Status | undefined> => {
    const server = await ServerModel.getServerById(serverId);
    const status = this.cache.get(serverId);

    if (server && status) {
      const newStatus = { ...status, restartSignalled: true };
      await this.notifySubscribers(server, newStatus);

      return newStatus;
    }
  }

  protected pollAndUpdate = async (): Promise<void> => {
    console.log('[StatusPoller] Polling Beamdog for server status changes...');
    const servers = await ServerModel.getServers();
    for (const server of servers) {
      const newStatus = await this.resolveNewStatus(server);

      if (newStatus) {
        const { id } = server;

        const status = this.cache.get(id);
        if (status && this.shouldNotify(status, newStatus)) {
          try {
            console.log('[StatusPoller] Found new server status, posting to subscribers.');
            await this.notifySubscribers(server, newStatus);
          } catch (error) {
            console.error('[StatusPoller.pollAndUpdate] Unhandled error while notifying subscribers.', error);
          }
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

      const channel = await this.findChannel(channelId);

      if (channel) {
        if (autoDeleteMessages && lastMessageId) {
          try {
            await channel.messages.delete(lastMessageId);
          } catch (error) {
            console.warn('[StatusPoller] Failed to delete last message.', error);
          }
        }

        try {
          const newMsg = await channel.send('', messageEmbed);
          await SubscriptionModel.update({
            lastMessageId: newMsg.id,
          }, {
            where: sub,
          });
        } catch (error) {
          if (error instanceof DiscordAPIError) {
            console.warn(`[StatusPoller] Failed to notify subscriber, channelId ${channelId}.`, error);
          } else if (error instanceof HTTPError) {
            console.warn(`[StatusPoller] Failed to notify subscriber, channelId ${channelId}. Deleting lastMessageId as we were unable to update it.`, error);
            await SubscriptionModel.update({
              lastMessageId: undefined,
            }, {
              where: sub,
            });
          } else {
            console.error(`[StatusPoller] Unexpected error while notifying subscriber, channelId ${channelId}.`, error);
          }
        }
      }
    }
  }

  private findChannel = async (channelId: string): Promise<TextChannel | undefined> => {
    try {
      return await this.client.channels.fetch(channelId) as TextChannel;
    } catch (error) {
      if (error instanceof DiscordAPIError) {
        if (error.code === 10003) {
          console.warn(`[StatusPoller] Unknown subscribed channel, channelId ${channelId}. Deleting subscriptions that use this channel.`, error);
          await SubscriptionModel.destroy({
            where: {
              channelId,
            },
          });

          return;
        }
      }

      console.error('[StatusPoller] Unexpected error.', error);
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
    } catch (error) {
      if (error instanceof BeamdogApiError) {
        if (error.code === 400) {
          console.error('[StatusPoller] Attempted an invalid request against the Beamdog API.', error);
        }

        if (error.code === 404) {
          console.log('[StatusPoller] Received 404 from Beamdog API; assuming requested server is offline.');
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

      console.error('[StatusPoller] Unexpected error.', error);
    }
  }

  protected createStatusUpdateEmbed = serverStatusToStatusUpdateEmbed;
}
