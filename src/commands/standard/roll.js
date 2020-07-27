'use strict';
const { Dice } = require('../../assets');
const { diceRollRegExp, rollAny } = Dice;
const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');

module.exports = class Roll extends Command {
  constructor(client) {
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
          validate: roll => {
            if (diceRollRegExp.test(roll.replace(/\s/g, ''))) return true;
            return 'That\'s not a valid form of dice notation.';
          }
        }
      ]
    });
  }

  async run(msg, { roll }) {
    const {
      rollString,
      result
    } = rollAny(roll.replace(/\s/g, ''));
    const embed = new RichEmbed();
    embed.setColor(0xffffff);
    embed.setDescription(`Roll ${rollString}: **${result}**`);
    return msg.embed(embed);
  }
};
