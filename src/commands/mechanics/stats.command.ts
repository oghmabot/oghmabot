import { Message } from 'discord.js';
import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';
import { stripCommandNotation } from '../../utils';

export class StatsCommand extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: 'stats',
      group: 'mechanics',
      memberName: 'stats',
      description: 'Calculates base attack bonus and saving throws for a given class spread.',
      args: [
        {
          key: 'input',
          type: 'string',
          prompt: 'Specify the class spread you want to calculate.',
          parse: stripCommandNotation,
        },
      ],
    });
  }

  run(msg: CommandoMessage, { input }: { input: string }): Promise<Message> {
    const classes = this.parseInput(input);
    return msg.reply(classes);
  }

  parseInput(input: string): string[] {
    return input.split(' ');
  }
}
