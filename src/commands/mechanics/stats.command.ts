import { Message } from 'discord.js';
import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';
import { StatsEmbed } from '../../client';
import { ClassLevelNotation, getClass, getStats } from '../../data/models';
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
    try {
      const stats = input.split(',').map(this.parseInput).map(c => getStats(...c));
      const message = stats.find(s => s.totalLevels > 20) ? 'When given more than 20 levels, pre-epic class spread is assumed from input order.' : '';
      return msg.reply(message, new StatsEmbed(stats));
    } catch (error) {
      if (error instanceof SyntaxError) {
        console.warn(error);
        return msg.reply('Invalid input.');
      } else {
        console.error('[StatsCommand] Unexpected error.', error);
      }
    }

    return msg.reply('Failed to calculate stats.');
  }

  parseInput(input: string): ClassLevelNotation[] {
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

    const classes = matches.flatMap(m => {
      const c = getClass(m[2]);
      const l = parseInt(m[3]);
      return c && l
        ? { class: c, level: l }
        : [];
    });

    if (!classes.length || classes.length !== matches.length) throw new SyntaxError('[StatsCommand] Invalid input.');
    return classes;
  }
}
