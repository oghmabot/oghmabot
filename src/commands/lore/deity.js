'use strict';

const {Command} = require('discord.js-commando');
const Discord = require('discord.js');

module.exports = class Deity extends Command {
  constructor(client) {
    super(client, {
      name: 'deity',
      group: 'lore',
      memberName: 'deity',
      description: 'Replies with the details of a deity in the Arelith pantheon.',
	  args: [
        {
          key: 'deity',
          type: 'string',
          prompt: 'Specify deity of which you want to find details.'
        }
      ]
      // Can add a key "args" which includes an array of parameters expected to
      // be passed when using the command, such as recipe id or name or searchString
      // See other commands for examples of args
    });

    this.pantheon = client.assets.Lore.Deity;
  }

  async run(msg, {deity} ) {
    let deityCard = await this.pantheon.findDeity(deity.trim());
    if (Object.keys(deityCard).length == 0)
    {
        return msg.say('Deity not found in the Arelith pantheon.');
    }
    else
    {
        var wikiURL = "https://forgottenrealms.fandom.com/wiki";
        if (deityCard.name == 'Oogooboogoo' || deityCard.name == "La'laskra")
        {
            wikiURL = 'http://wiki.arelith.com'
        }
        var embed = new Discord.RichEmbed();
        if (msg.guild)
        {
            embed.setColor(msg.guild.me.displayColor);
        }
        else
        {
            embed.setColor(0xffffff);
        }
        embed.setTitle(deityCard.name);
        embed.setURL(wikiURL+deityCard.url);
        embed.setDescription("*"+deityCard.titles+"*");
        embed.setFooter("Oghmabot","https://i.imgur.com/DBAtbUx.png");
        embed.setTimestamp();
        embed.addField("Alignment", deityCard.alignment);
        embed.addField("Clergy Alignments", deityCard.clergyAlignments);
        embed.addField("Aspects", deityCard.primaryAspect + " and " + deityCard.secondaryAspect);
        var infoField = "";
        infoField += (deityCard.symbol) ? "**Symbol:** " + deityCard.symbol : "";
        infoField += (deityCard.portfolio) ?  "\n**Portfolio:** " + deityCard.portfolio : "";
        infoField += (deityCard.worshipers) ? "\n**Worshipers:** " + deityCard.worshipers : "";
        infoField += (deityCard.domains) ? "\n**Domains:** " + deityCard.domains : "";
        if (infoField) {
            embed.addField(":book:", infoField + "\n");
        }
        if (deityCard.thumbnail) {
            embed.setThumbnail(deityCard.thumbnail);
        }
        if (deityCard.dogma) {
            const dogmaBuffer = (deityCard.dogma.length > 1024) ? deityCard.dogma.slice(0,1021) + "..." : deityCard.dogma;
            embed.addField("Dogma", dogmaBuffer);
        }

        return msg.embed(embed);
    }

	  //return msg.code("adoc", pantheon.findDeity(deity.trim()));
    // Insert here the stuff that actually happens when the command is called???
  }
}