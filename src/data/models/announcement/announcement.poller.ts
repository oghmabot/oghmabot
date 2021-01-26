import { CommandoClient } from 'discord.js-commando';
import { BasePoller } from '../../common';
import { Announcement } from './announcement.model';

export class AnnouncementPoller extends BasePoller<Announcement> {
  constructor(client: CommandoClient, interval: number = 300000) {
    super(client, interval);
    this.activatePolling();
  }

  protected pollAndUpdate(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  public getOrFetch(key: string): Promise<Announcement | undefined> {
    throw new Error('Method not implemented.');
  }

}
