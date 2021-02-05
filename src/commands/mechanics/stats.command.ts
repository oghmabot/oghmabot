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
    console.log(classes);
    return msg.reply(classes?.join(', ') ?? 'No match.');
  }

  parseInput(input: string): { class: string, levels: number }[] {
    const re = /(([a-z]+).*?([0-9]+))/ig;
    const matches = [];
    let finished = false;
    while (!finished) {
      const match = re.exec(input);
      if (match) {
        matches.push(match);
      } else {
        finished = true;
      }
    }

    return matches.map(m => (
      {
        class: m[2],
        levels: parseInt(m[3]),
      }
    ));
  }
}
