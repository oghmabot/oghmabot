import { Collection } from 'discord.js';
import { CommandoClient, CommandoClientOptions } from 'discord.js-commando';
import { getAllCommands } from '../commands';
import { StatusPoller } from '../data/models';
import { BasePoller } from '../data/common';
import { handleClientError, handleClientReady, handleGuildCreate, handleGuildDelete } from './events';
import { handleMessageDelete } from './events/messageDelete.event';

export class OghmabotClient extends CommandoClient {
  pollers: Collection<string, BasePoller<unknown>> = new Collection();

  constructor(options?: CommandoClientOptions) {
    super(options);
    this.setDefaultPollers();
    this.setRegistryDefaults();
    this.setEventListeners();
  }

  setDefaultPollers(): void {
    this.pollers.set('status', new StatusPoller(this));
  }

  setRegistryDefaults(): void {
    this.registry
      .registerGroups([
        ['owner', 'Owner'],
        ['arelith', 'Arelith'],
        ['nwn', 'Neverwinter Nights'],
      ])
      .registerDefaultTypes()
      .registerDefaultGroups()
      .registerDefaultCommands({ prefix: false, unknownCommand: false })
      .registerCommands(getAllCommands());
  }

  setEventListeners(): void {
    this.on('error', handleClientError);
    this.on('guildCreate', handleGuildCreate);
    this.on('guildDelete', handleGuildDelete);
    this.on('messageDelete', handleMessageDelete);
    this.on('ready', async () => await handleClientReady(this));
  }
}
