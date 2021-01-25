import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';
import { roll, RollOptions, RollResult } from '@half-elf/rogue';
import { getOghmabotEmbed, stripCommandNotation } from '../../utils';
import { Message } from 'discord.js';

export class RollCommand extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: 'roll',
      group: 'nwn',
      memberName: 'roll',
      description: 'Resolves a given d20-style dice roll.',
      args: [
        {
          key: 'input',
          type: 'string',
          prompt: 'Specify the roll you want to make.',
          parse: stripCommandNotation,
        },
      ],
    });
  }

  run(msg: CommandoMessage, { input }: { input: string }): Promise<Message> {
    try {
      const { notation, options } = this.parseInput(input);
      return options
        ? this.formatRollResult(msg, roll(notation, this.parseOptions(options)))
        : msg.say(`:game_die: Result: ${roll(notation)}`);
    } catch (error) {
      console.error('[RollCommand] Unexpected error.', error);
    }

    return msg.reply('Invalid input.');
  }

  formatRollResult(msg: CommandoMessage, roll: RollResult): Promise<CommandoMessage> {
    const { input, total, max, min, avg } = roll;
    const embed = getOghmabotEmbed();
    embed.setTitle(`:game_die: Result: **${total}**`);
    embed.setDescription(`Rolled ${input}`);
    if (max) embed.addField('Maximum', max, true);
    if (min) embed.addField('Minimum', min, true);
    if (avg) embed.addField('Average', avg, true);

    return msg.embed(embed);
  }

  parseInput(input: string): { notation: string, options?: string[] } {
    const re = /([-]?v|verbose|max|min|avg|maximum|minimum|average)/ig;
    const match = re.exec(input);
    if (match) {
      const { index } = match;
      return {
        notation: input.substr(0, index),
        options: input.match(re) || [],
      };
    }
    return { notation: input };
  }

  parseOptions(options: string[]): RollOptions {
    const rollOptions: RollOptions = {};
    for (const option of options) {
      if (['-v', 'v', 'verbose'].includes(option)) {
        return {
          max: true,
          min: true,
          avg: true,
        };
      }

      if (option.includes('max')) rollOptions.max = true;
      if (option.includes('min')) rollOptions.min = true;
      if (option.includes('avg')) rollOptions.avg = true;
    }
    return rollOptions;
  }
}
