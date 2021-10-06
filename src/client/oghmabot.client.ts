import { Collection } from 'discord.js';
import { CommandoClient, CommandoClientOptions } from 'discord.js-commando';
import { getAllCommands } from '../commands';
import {
  handleClientError,
  handleClientReady,
  handleGuildCreate,
  handleGuildDelete,
  handleMessageEvent,
  handleProcessError,
  handleProcessRejection,
} from './events';
import { BasePoller, MessageExpiryPoller, StatusPoller } from './pollers';
import { SequelizeProvider } from './settings';

export class OghmabotError extends Error {
  client: OghmabotClient;

  constructor(message: string, client: OghmabotClient) {
    super(message);
    this.client = client;
  }
}

export class OghmabotClient extends CommandoClient {
  pollers: Collection<string, BasePoller<unknown>> = new Collection();

  constructor(options?: CommandoClientOptions) {
    super(options);
    this.setDefaultPollers();
    this.setRegistryDefaults();
    this.setClientEventListeners();
    this.setProcessEventListeners();
    this.setProvider(new SequelizeProvider(this));
  }

  setDefaultPollers(): void {
    this.pollers.set('messageExpiry', new MessageExpiryPoller(this));
    this.pollers.set('status', new StatusPoller(this));
  }

  setRegistryDefaults(): void {
    this.registry
      .registerDefaultTypes()
      .registerGroups([
        ['server', 'Server Information'],
        ['lore', 'Lore'],
        ['mechanics', 'Mechanics'],
        ['commands', 'Command Administration'],
        ['util', 'Help'],
        ['owner', 'Owner'],
      ])
      .registerDefaultCommands({ prefix: false, unknownCommand: false })
      .registerCommands(getAllCommands());
  }

  setClientEventListeners(): void {
    this.on('error', error =>  handleClientError(this, error));
    this.on('guildCreate', handleGuildCreate);
    this.on('guildDelete', handleGuildDelete);
    this.on('message', handleMessageEvent);
    this.on('ready', () => handleClientReady(this));
  }

  setProcessEventListeners(): void {
    process.on('uncaughtException', error => handleProcessError(this, error));
    process.on('unhandledRejection', reason => handleProcessRejection(this, reason));
  }
}
