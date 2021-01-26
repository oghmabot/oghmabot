import { Message } from 'discord.js';
import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';
import { stripCommandNotation } from '../../utils';

export class HeresyCommand extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: 'heresy',
      group: 'TODO',
      memberName: 'heresy',
      description: 'Replies with the details of a heresy in the Arelith pantheon.',
      args: [
        {
          key: 'query',
          type: 'string',
          prompt: 'Specify the heresy you want to find.',
          parse: stripCommandNotation,
        },
      ],
      throttling: {
        duration: 10,
        usages: 2,
      },
    });
  }

  async run(msg: CommandoMessage, { query }: { query: string }): Promise<Message> {
    throw new Error('Command not implemented.');
  }
}
