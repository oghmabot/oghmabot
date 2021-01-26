import { Message } from 'discord.js';
import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';
import { stripCommandNotation } from '../../utils';

export class RecipeCommand extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: 'recipe',
      group: 'TODO',
      memberName: 'recipe',
      aliases: ['recipes'],
      description: 'Searches for a specific recipe.',
      args: [
        {
          key: 'identifier',
          type: 'string',
          prompt: 'Specify the name or id of a specific recipe.',
          parse: stripCommandNotation,
        },
      ],
    });
  }

  async run(msg: CommandoMessage, { identifier }: { identifier: string }): Promise<Message> {
    throw new Error('Command not implemented.');
  }
}
