'use strict';

const { RichEmbed, WebhookClient } = require('discord.js');

module.exports = {
  run: function (bot) {
    /**
     * When bot is ready, output logged in servers
     * @ignore
     */
    bot.on('ready', () => {
      const { guilds } = bot;
      const wb = guilds.resolve('555159220777910273');

      if (wb && bot.mode == "live") {
        const embedOnline = loggedInServersToEmbed(guilds);
        const wbClient = new WebhookClient(wb.id, wb.token);
        wbClient.name = "Oghmabot Online";
        wbClient.send("", embedOnline);
      }

      console.log(loggedInServersToString(guilds));
    });


    /**
     * Listen for messages and make sure the bot doesn't respond to itself
     * @ignore
     */
    bot.on('message', msg => {
      if (msg.author.id === bot.user.id) return;
    });
  }
}

/**
 * Return a RichEmbed including the given servers
 * @param {GuildManager} servers 
 */
function loggedInServersToEmbed(servers) {
  const embed = new RichEmbed();
  embed.setColor(0x00ff00);
  embed.setTitle("Oghmabot Online");
  embed.setDescription(loggedInServersToString(servers));
  return embed;
}

/**
 * Return a string showing the given servers
 * @param {GuildManager} servers 
 */
function loggedInServersToString(servers) {
  return `Logged in to servers: ${servers.cache.map(g => g.name).join(', ')}`;
}
