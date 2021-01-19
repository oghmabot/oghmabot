import { Message } from 'discord.js';
import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';

import { Server, ServerModel } from '../../data';
import { BeamdogApiError, fetchServer } from '../../data/proxy';
import { isValidBeamdogIdentifier, isValidURL } from '../../utils';

interface ServerCommandArgs {
  descriptor: string;
  identifier: string;
  input?: string;
}

export class ServerCommand extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: 'server',
      group: 'owner',
      memberName: 'server',
      description: 'Add and manage known servers.',
      ownerOnly: true,
      args: [
        {
          key: 'descriptor',
          prompt: 'new/remove/alias/href/img',
          type: 'string',
          validate: (text: string) => [
            'new', 'add', 'remove', 'rm', 'alias', 'name', 'href', 'img',
          ].includes(text.toLowerCase().trim()),
        },
        {
          key: 'identifier',
          prompt: 'Please supply a valid server identifier.',
          type: 'string',
          validate: isValidBeamdogIdentifier,
        },
        {
          key: 'input',
          prompt: 'Varies with usage.',
          type: 'string',
          default: '',
        },
      ],
    });
  }

  async run(msg: CommandoMessage, args: ServerCommandArgs): Promise<any> {
    const { descriptor } = args;

    if (descriptor === 'new' || descriptor === 'add') {
      return await this.addNewServer(msg, args);
    }

    if (descriptor === 'remove' || descriptor === 'rm') {
      return await this.removeServer(msg, args);
    }

    if (descriptor === 'alias') {
      return await this.addAlias(msg, args);
    }

    if (descriptor === 'name') {
      return await this.setField(msg, args, descriptor);
    }

    if (descriptor === 'href' || descriptor === 'link') {
      const { input } = args;
      if (input && isValidURL(input)) return await this.setField(msg, args, 'href');
    }

    if (descriptor === 'img') {
      const { input } = args;
      if (input && isValidURL(input)) return await this.setField(msg, args, 'img');
    }

    return msg.say('Invalid input');
  }

  async addNewServer(msg: CommandoMessage, args: ServerCommandArgs): Promise<Message | CommandoMessage> {
    const { identifier } = args;

    try {
      const server = await fetchServer(identifier, ServerModel);

      if (await ServerModel.serverExists(server)) {
        return msg.say('Server already exists.');
      } else {
        await ServerModel.addServer(server);
        return msg.say(this.formatServerAddedReply(server));
      }
    } catch (err) {
      if (err instanceof BeamdogApiError) {
        return this.handleBeamdogApiError(msg, err);
      } else {
        console.error(err);
      }
    }

    return msg.say('Failed to add new server.');
  }

  async removeServer(msg: CommandoMessage, args: ServerCommandArgs): Promise<Message | CommandoMessage> {
    const { identifier } = args;

    try {
      const server = await ServerModel.getServerById(identifier);
      if (server === undefined) return msg.say('Cannot remove that which does not exist.');

      if (await ServerModel.removeServer(server)) return msg.say('Successfully removed server.');
    } catch (err) {
      console.error(err);
    }

    return msg.say('Failed to remove server.');
  }

  async addAlias(msg: CommandoMessage, args: ServerCommandArgs): Promise<Message | CommandoMessage> {
    const { identifier, input } = args;
    if (input === undefined) return msg.say('One or more aliases must be provided.');

    try {
      const server = await ServerModel.getServerById(identifier);
      if (server === undefined) return msg.say('No known server by that identifier.');

      const newAliasArray = server.alias
        ? [...server.alias, ...input.toLowerCase().split(' ')]
        : input.toLowerCase().split(' ');

      await ServerModel.update({
        alias: newAliasArray.filter((val, i) => newAliasArray.indexOf(val) === i),
      }, {
        where: {
          id: server.id,
        },
      });

      return msg.say('Successfully added new aliases.');
    } catch (err) {
      console.error(err);
    }

    return msg.say('Failed to add alias.');
  }

  async setField(msg: CommandoMessage, args: ServerCommandArgs, field: string): Promise<Message | CommandoMessage> {
    const { identifier, input } = args;
    if (!input) return msg.say('Invalid input.');

    try {
      const server = await ServerModel.getServerById(identifier);
      if (!server) return msg.say('No known server by that identifier');

      const newFields: { [field: string]: string } = {};
      newFields[field] = input;

      await ServerModel.update(newFields, {
        where: {
          id: server.id,
        },
      });

      return msg.say(`Successfully set new ${field}.`);
    } catch (err) {
      console.error(err);
    }

    return msg.say(`Failed to set ${field}.`);
  }

  handleBeamdogApiError = (msg: CommandoMessage, error: BeamdogApiError): Promise<Message | CommandoMessage> =>
    msg.say(error.code === 400 ? 'Invalid identifier' : 'Server is unavailable or does not exist.')

  formatServerAddedReply = (server: Server): string => (
    'Server added.'
    + '\n```'
    + `\nID: ${server.id}`
    + `\nNAME: ${server.name}`
    + `\nIP: ${server.ip}`
    + `\nPORT: ${server.port}`
    + `\nALIAS: ${server.alias}`
    + `\nHREF: ${server.href}`
    + `\nIMG: ${server.img}`
    + '\n```'
  );
}