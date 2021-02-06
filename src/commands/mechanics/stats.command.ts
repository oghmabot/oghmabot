import { Message } from 'discord.js';
import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';
import { OghmabotEmbed } from '../../client';
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
    const classes = this.parseInput(input);
    const stats = getStats(...classes);
    const embed = new OghmabotEmbed();
    embed.addField('BAB', stats.bab);
    embed.addField('Fortitude', stats.fortitude);
    embed.addField('Reflex', stats.reflex);
    embed.addField('Will', stats.will);
    return msg.reply(embed);
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

    return matches.flatMap(m => {
      const c = getClass(m[2]);
      const l = parseInt(m[3]);
      return c && l
        ? { class: c, level: l }
        : [];
    });
  }
}
