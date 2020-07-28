'use strict';

const { ArelithIP, ArelithServers, BeamdogAPI } = require('./config.json');
const { getEnmap } = require('../../../db');
const { RichEmbed } = require('discord.js');
const fetch = require('node-fetch');

const updateServerStatus = async (client) => {
  const serversEnmap = getEnmap('servers');

  for(const i in ArelithServers) {
    const server = ArelithServers[i];
    const status = await fetchServerStatus(server);

    if(status.state === 'Online' && serversEnmap.get(i, 'state') !== 'Online') {
      postServerStatus(client, server, status);
    }
    serversEnmap.set(i, status);
  }
};

const postServerStatus = (client, server, status) => {
  const statusEmbed = serverStateToEmbed(server, status.state);
  return statusEmbed; // TODO: Iterate over webhooks that want server status updates
};

const serverStateToEmbed = (server, state) => {
  const embed = new RichEmbed();
  embed.setColor(state === 'Online' ? 0x00ff00 : 0xffcc00);
  embed.setTitle(`${server.name} is now ${state.toLowerCase()}.`);
  embed.setTimestamp();
  embed.setThumbnail(server.thumbnail);
  return embed;
};

const fetchServerStatus = async (server) => {
  const apiResponse = await fetch(`${BeamdogAPI}${ArelithIP}/${server.port}`).then(response => response.json());
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
