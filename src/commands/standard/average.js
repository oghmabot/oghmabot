'use strict';

const {Command} = require('discord.js-commando');
const Discord = require('discord.js');
const diceRollRegExp = /^(\d*)(D\d+)((?:[+-]\d*(?:D\d+)?)*)/gi;

module.exports = class Average extends Command {
  constructor(client) {
    super(client, {
      name: 'average',
      group: 'standard',
      memberName: 'average',
      aliases: ["avg"],
      description: 'Replies with the average result to a D&D style dice roll.',
      args: [
        {
          key: 'roll',
          type: 'string',
          prompt: 'Specify the roll of you want the average.',
          validate: roll => {
              if (diceRollRegExp.test(roll.replace(/\s/g,''))) return true;
              return "That's not a valid form of dice notation.";
          }
        }
      ]
    });

    this.Dice = client.assets.Dice;
  }

  async run(msg, {roll}) {

    var total = await this.Dice.averageRoll(roll.replace(/\s/g,''));
    var embed = new Discord.RichEmbed();
    if (msg.guild)
    {
        embed.setColor(msg.guild.me.displayColor);
    }
    else
    {
        embed.setColor(0xffffff);
    }
    embed.setDescription(`Average roll: **${total}**`);
    //embed.setFooter("\u200b","https://i.imgur.com/8T9VJa0.png")
    return msg.embed(embed);
  }
};
