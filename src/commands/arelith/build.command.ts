import { Message } from 'discord.js';
import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';
import { stripCommandNotation } from '../../utils';

export class BuildCommand extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: 'build',
      group: 'TODO',
      memberName: 'build',
      aliases: ['builds'],
      description: 'Replies with a list of relevant character builds.',
      args: [
        {
          key: 'query',
          type: 'string',
          prompt: 'Specify something to filter builds by.',
          parse: stripCommandNotation,
        },
      ],
    });
  }

  async run(msg: CommandoMessage, { query }: { query: string }): Promise<Message> {
    throw new Error('Command not implemented.');
  }
}
