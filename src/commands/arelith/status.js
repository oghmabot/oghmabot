'use strict';

const {Command} = require('discord.js-commando');
const Discord = require('discord.js');

module.exports = class Status extends Command {
  constructor(client) {
    super(client, {
      name: 'status',
      group: 'arelith',
      memberName: 'status',
      description: 'Replies with the current status of Arelith servers. A server may be specified.',
      args: [
        {
          key: 'options',
          type: 'string',
          prompt: 'Set Oghmabot to announce statuses here?',
          default: "",
        }
      ]
      // Can add a key "args" which includes an array of parameters expected to
      // be passed when using the command, such as recipe id or name or searchString
      // See other commands for examples of args
    });

    this.arelith = client.assets.Arelith.Status; 
  }

  async run(msg, {options}) {

    const arg = options.toLowerCase().trim();

    if (msg.guild && msg.member.hasPermission('MANAGE_WEBHOOKS'))
    {
        if ( arg == "here")
        {
            if (msg.guild.me.hasPermission('MANAGE_WEBHOOKS'))
            {
                const wbs = await msg.channel.fetchWebhooks();
                const wb = await wbs.find(webhooks => webhooks.name == "Oghmabot");
                if (!wb)
                {
                    const newWB =  await msg.channel.createWebhook("Oghmabot","https://i.imgur.com/DBAtbUx.png");
                    this.client.settings.set(msg.guild.id, { id: newWB.id, token: newWB.token}, "statusWebhook");
                    this.client.settings.set(msg.guild.id, true, "statusState");
                    return msg.say("Webhook created on this channel. Server status will be updated here.");
                }
                else
                {
                    this.client.settings.set(msg.guild.id, { id: wb.id, token: wb.token}, "statusWebhook");
                    this.client.settings.set(msg.guild.id, true, "statusState");
                    return msg.say("Webhook relinked on this channel. Server status will be updated here.");
                }
            }
            else
            {
                return msg.say("Oghmabot is lacking the proper permissions to create a webhook.");
            }
        }
        else if (arg == "on")
        {
            this.client.settings.set(msg.guild.id, true, "statusState");
            return msg.say("Server status updates: **On**.");
        }
        else if (arg == "off")
        {
            this.client.settings.set(msg.guild.id, false, "statusState");
            return msg.say("Server status updates: **Off**.");
        }
    }

    var i, j;
    i = 1;
    j = 3;
    switch (arg)
    {
        case "surface":
            i = j = 1;
            break;
        case "distant shores":
        case "ds":
            i = j = 3;
            break;
        case "cities and planes":
        case "cities & planes":
        case "c&p":
        case "cnp":
        case "c and p":
            i = j = 2;
            break;
    }

    var statusCard;
    var embedArray = [];

    for (i ; i <= j; i++)
    {
        statusCard =  await this.client.servers.get(i);
        embedArray[i] = new Discord.RichEmbed();
        embedArray[i].setColor(statusCard.color);
        embedArray[i].setTitle(statusCard.name);
        embedArray[i].setDescription(`**${statusCard.state}** :hourglass: ${statusCard.uptime} :busts_in_silhouette: ${statusCard.population}`);
        embedArray[i].setURL('http://portal.arelith.com/');
        //embedArray[i-1].setFooter("Oghmabot","https://i.imgur.com/DBAtbUx.png");
        //embedArray[i-1].setTimestamp();
        embedArray[i].setThumbnail(statusCard.thumbnail);
        await msg.embed(embedArray[i]);
    }

    return;

	  //return msg.code("adoc", pantheon.findDeity(deity.trim()));
    // Insert here the stuff that actually happens when the command is called???
  }
}