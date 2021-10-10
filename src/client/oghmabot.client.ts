import { Collection } from 'discord.js';
import { CommandoClient, CommandoClientOptions } from 'discord.js-commando';
import express, { Express, json } from 'express';

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
import { handleGetStatus, handlePostStatus } from './webhooks';

export class OghmabotError extends Error {
  client: OghmabotClient;

  constructor(message: string, client: OghmabotClient) {
    super(message);
    this.client = client;
  }
}

export class OghmabotClient extends CommandoClient {
  webhook: Express = express();
  pollers: Collection<string, BasePoller<unknown>> = new Collection();

  constructor(options?: CommandoClientOptions) {
    super(options);
    this.setDefaultPollers();
    this.setRegistryDefaults();
    this.setClientEventListeners();
    this.setProcessEventListeners();
    this.setWebhooks();
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

  setWebhooks(): void {
    this.webhook.use(json());
    this.webhook.get('/', (_, response) => response.send());
    this.webhook.get('/status', (req, res) => handleGetStatus(this, req, res));
    this.webhook.get('/status/:id', (req, res) => handleGetStatus(this, req, res));
    this.webhook.post('/status', (req, res) => handlePostStatus(this, req, res));

    const { PORT = 80 } = process.env;
    this.webhook.listen(PORT, () => console.log(`Webhooks listening on port ${PORT}...`));
  }
}
