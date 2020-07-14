'use strict';

const Discord = require('discord.js');

module.exports = {
  run: function (bot) {
    /**
     * When bot is ready, output logged in servers
     * @ignore
     */
    bot.on('ready', () => {
      console.log(loggedInServersToString(bot));

      const wb = bot.settings.get('528197859854647299', "statusWebhook");      
      if (wb && bot.mode == "live") {
        const embedOnline = loggedInServersToEmbed(bot);
        const wbClient = new Discord.WebhookClient(wb.id, wb.token);
        wbClient.name = "Oghmabot Online";
        wbClient.send("", embedOnline);
      }
    });


    /**
     * Listen for messages
     */
    bot.on('message', msg => {
      if (msg.author.id === bot.user.id) return;

      if (msg.guild) {
        // This section may refer to guild-customized content
      }
    });

    /**
     * Listen for server joining
     */
    bot.on('guildCreate', guild => {
      if (!bot.settings.has(guild.id)) {
        bot.settings.set(guild.id, bot.defaultSettings);
      }
    });

    /**
     * Listen for server removal
     */
    bot.on("guildDelete", guild => {
      // When the bot leaves or is kicked, delete settings and webhooks to prevent stale entries.
      //bot.webhooks.delete(guild.id);
    });
  }
}

function loggedInServersToEmbed(bot) {
  const embed = new Discord.RichEmbed();
  embed.setColor(0x00ff00);
  embed.setTitle("Oghmabot Online");
  embed.setDescription(loggedInServersToString(bot));
  return embed;
}

function loggedInServersToString(bot) {
  return `Logged in to servers: ${Array.from(bot.guilds.values())}`;
}
