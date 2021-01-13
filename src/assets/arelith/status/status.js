'use strict';

const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

const { Server } = require('../../../db');

const ArelithPortal = 'http://portal.nwnarelith.com/';
const BeamdogAPI = 'https://api.nwn.beamdog.net/v1/servers/';

const updateServerStatus = async (client) => {
  for (const server of await Server.getServers()) {
    const status = await fetchServerStatus(server);

    if (/*status.state !== */ false) {
      /*
      for (const channel of await StatusUpdate.getChannels()) {
        // Use postServerStatus to post embed to each subscribed channel
        const { id } = channel;
        client.channels.cache.find(c => c.id == id).send(postServerStatus(client, server, status));
      }
      */
    }
  }

  /*const serversEnmap = getEnmap('servers');
  const settingsEnmap = getEnmap('settings');

  for(const i in ArelithServers) {
    const server = ArelithServers[i];
    const status = await fetchServerStatus(server);

    if(serversEnmap.has(server.name) && serversEnmap.get(server.name, 'state') !== status.state) {
      for(const key of settingsEnmap.indexes) {
        const { active, channel } = settingsEnmap.fetch(key).status;
        if(active) {
          client.guilds.find(g => g.id == key).channels.find(c => c.id == channel).send(postServerStatus(client, server, status));
        }
      }
    }

    serversEnmap.set(server.name, status);
  }*/
};

const postServerStatus = (client, server, status) => {
  const statusEmbed = serverStateToEmbed(server, status);
  return statusEmbed; // TODO: Iterate over webhooks that want server status updates
};

const serverStateToEmbed = (server, status) => {
  const embed = new MessageEmbed();
  embed.setColor(status.state === 'Online' ? 0x00ff00 : 0xffcc00);
  embed.setTitle(`${server.name} is now ${status.state.toLowerCase()}.`);
  embed.setTimestamp();
  embed.setThumbnail(server.img);
  embed.setTitle(server.name);
  embed.setDescription(`**${status.state}** :hourglass: ${status.uptime} :busts_in_silhouette: ${status.players}`);
  embed.setURL(ArelithPortal);
  return embed;
};

const fetchServerStatus = async (server) => {
  const apiResponse = await fetch(`${BeamdogAPI}${server.ip}/${server.port}`).then(response => response.json());
  return parseApiResponse(apiResponse);
};

const parseApiResponse = (response) => {
  return {
    name: response.session_name,
    module: response.module_name,
    players: response.current_players,
    state: 'Online',
    uptime: calculateUptime(response.first_seen, response.last_advertisement),
  };
};

const calculateUptime = (first_seen, last_seen) => new Date(Math.abs(first_seen - last_seen) * 1000).toISOString().substr(11, 8);

module.exports = {
  fetchServerStatus,
  serverStateToEmbed,
  updateServerStatus,
};
