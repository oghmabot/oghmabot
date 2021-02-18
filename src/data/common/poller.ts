import { Collection } from 'discord.js';
import { CommandoClient } from 'discord.js-commando';

export abstract class BasePoller<T> {
  private interval: number;
  client: CommandoClient;
  cache: Collection<string, T>;

  constructor(client: CommandoClient, interval: number) {
    this.interval = interval;
    this.client = client;
    this.cache = new Collection();
  }

  protected activatePolling(): void {
    this.client.setInterval(this.pollAndUpdate, this.interval);
  }

  public abstract fetch(key: string): Promise<T | undefined>;

  protected abstract pollAndUpdate(): Promise<void>;
}
