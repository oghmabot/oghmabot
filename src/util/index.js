const { RichEmbed } = require('discord.js');

module.exports = {
  loggedInServersToEmbed,
  loggedInServersToString
};

/**
 * Return a RichEmbed including the given servers
 * @param {GuildManager} servers
 */
function loggedInServersToEmbed(servers) {
  const embed = new RichEmbed();
  embed.setColor(0x00ff00);
  embed.setTitle('Oghmabot Online');
  embed.setDescription(loggedInServersToString(servers));
  return embed;
}

/**
 * Return a string showing the given servers
 * @param {GuildManager} servers
 */
function loggedInServersToString(servers) {
  return `Logged in to servers: ${servers.map(g => g.name).join(', ')}`;
}
