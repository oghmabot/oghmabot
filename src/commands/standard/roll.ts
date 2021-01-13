import { MessageEmbed } from 'discord.js';
import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";

import { diceRollRegExp, rollAny } from '../../assets/dice';

export class Roll extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: 'roll',
      group: 'standard',
      memberName: 'roll',
      description: 'Replies with the random result to a D&D style dice roll.',
      args: [
        {
          key: 'roll',
          type: 'string',
          prompt: 'Specify the roll you want to make.',
          validate: (roll: string) => {
            if (diceRollRegExp.test(roll.replace(/\s/g, ''))) return true;
            return 'That\'s not a valid form of dice notation.';
          },
        },
      ],
    });
  }

  async run(msg: CommandoMessage, { roll }: { roll: string }): Promise<any> {
    const {
      rollString,
      result,
    } = rollAny(roll.replace(/\s/g, ''));
    const embed = new MessageEmbed();
    embed.setColor(0xffffff);
    embed.setDescription(`Roll ${rollString}: **${result}**`);
    return msg.embed(embed);
  }
};
