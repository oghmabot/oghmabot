'use strict';

const { Command } = require('discord.js-commando');
const Discord = require('discord.js');

module.exports = class Updates extends Command {
  constructor(client) {
    super(client, {
      name: 'updates',
      group: 'arelith',
      memberName: 'updates',
      aliases: ['announcements', 'update', 'announcement'],
      description: 'Replies with the latest update to Arelith.',
      args: [
        {
          key: 'options',
          type: 'string',
          prompt: 'Set Oghmabot to announce updates here?',
          default: '',
        }
      ]
      // Can add a key "args" which includes an array of parameters expected to
      // be passed when using the command, such as recipe id or name or searchString
      // See other commands for examples of args
    });

    this.arelith = client.assets.Arelith.Update;
  }

  async run(msg, { options }) {

    const arg = options.toLowerCase().trim();

    if (msg.guild && msg.member.hasPermission('MANAGE_WEBHOOKS')) {
      if (arg == 'here') {
        if (msg.guild.me.hasPermission('MANAGE_WEBHOOKS')) {
          const wbs = await msg.channel.fetchWebhooks();
          const wb = await wbs.find(webhooks => webhooks.name == 'Oghmabot');
          if (!wb) {
            const newWB = await msg.channel.createWebhook('Oghmabot', 'https://i.imgur.com/DBAtbUx.png');
            this.client.settings.set(msg.guild.id, { id: newWB.id, token: newWB.token }, 'announcementsWebhook');
            this.client.settings.set(msg.guild.id, true, 'announcementsState');
            return msg.say('Webhook created on this channel. Announcements will be made here.');
          }
          else {
            this.client.settings.set(msg.guild.id, { id: wb.id, token: wb.token }, 'announcementsWebhook');
            this.client.settings.set(msg.guild.id, true, 'announcementsState');
            return msg.say('Webhook relinked on this channel. Announcements will be made here.');
          }
        }
        else {
          return msg.say('Oghmabot is lacking the proper permissions to create a webhook.');
        }
      }
      else if (arg == 'on') {
        this.client.settings.set(msg.guild.id, true, 'announcementsState');
        return msg.say('Announcements: **On**.');
      }
      else if (arg == 'off') {
        this.client.settings.set(msg.guild.id, false, 'announcementsState');
        return msg.say('Announcements: **Off**.');
      }
    }

    let updateCard = await this.arelith.getLastUpdate();
    var embed = new Discord.RichEmbed();
    if (msg.guild) {
      embed.setColor(msg.guild.me.displayColor);
    }
    else {
      embed.setColor(0xffffff);
    }
    embed.setTitle('Latest Arelith Update');
    embed.setURL(updateCard.url);
    var contentAdjusted = (updateCard.content.length > 2048) ? updateCard.content.slice(0, 2045) + '...' : updateCard.content;
    embed.setDescription(contentAdjusted);
    embed.setFooter('Oghmabot', 'https://i.imgur.com/DBAtbUx.png');
    embed.setTimestamp();
    embed.setThumbnail('https://i.imgur.com/QJ4lnPJ.png');

    return msg.embed(embed);

    //return msg.code("adoc", pantheon.findDeity(deity.trim()));
    // Insert here the stuff that actually happens when the command is called???
  }
};