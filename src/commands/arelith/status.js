'use strict';

const { Arelith } = require('../../assets');
const { Command } = require('discord.js-commando');

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
          default: '',
        },
      ],
    });
  }

  async run(msg, { options }) {
    const {
      here,
      requestedServers,
    } = this.processOptions(this.preProcessOptions(options));

    if(here) {
      // TODO: Implement setting a webhook in given channel (msg.channel)
    } else if(requestedServers) {
      const { fetchServerStatus } = Arelith.status;
      requestedServers.forEach(async server => {
        const status = await fetchServerStatus(server);
        await msg.embed(this.createStatusEmbed(server, status));
      });
    }
  }

  preProcessOptions(options) {
    return options.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '').split(' ');
  }

  processOptions(options) {
    return {
      here: options.includes('here'),
      requestedServers: this.resolveRequestedServers(options),
    };
  }

  resolveRequestedServers(input) {
    const { ArelithServers } = Arelith;
    return ArelithServers.filter(server => server.abbreviations.filter(abbr => input.includes(abbr)).length) || ArelithServers;
  }

  createStatusEmbed(server, status) {
    const { ArelithPortal } = Arelith;
    const { serverStateToEmbed } = Arelith.status;
    const embed = serverStateToEmbed(server, status.state);
    embed.setTitle(server.name);
    embed.setDescription(`**${status.state}** :hourglass: ${status.uptime} :busts_in_silhouette: ${status.players}`);
    embed.setURL(ArelithPortal);
    return embed;
  }
};