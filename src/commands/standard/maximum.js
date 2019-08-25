'use strict';

const {Command} = require('discord.js-commando');
const Discord = require('discord.js');
const diceRollRegExp = /^(\d*)(D\d+)((?:[+-]\d*(?:D\d+)?)*)/gi;

module.exports = class Maximum extends Command {
  constructor(client) {
    super(client, {
      name: 'maximum',
      group: 'standard',
      memberName: 'maximum',
      aliases: ["max"],
      description: 'Replies with the maximum result to a D&D style dice roll.',
      args: [
        {
          key: 'roll',
          type: 'string',
          prompt: 'Specify the roll of which you want the maximum.',
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

    var total = await this.Dice.maximumRoll(roll.replace(/\s/g,''));
    var embed = new Discord.RichEmbed();
    if (msg.guild)
    {
        embed.setColor(msg.guild.me.displayColor);
    }
    else
    {
        embed.setColor(0xffffff);
    }
    embed.setDescription(`Maximum roll: **${total}**`);
    //embed.setThumbnail("https://i.imgur.com/AnSk6th.jpg");
    return msg.embed(embed);
  }
};
