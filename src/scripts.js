'use strict';

const Discord = require('discord.js');

module.exports = {
  run: function(bot) {
    bot.on('ready', () => {
      // Once the bot is ready, it outputs a list of active servers to console
      console.log(`Logged in to servers: ${Array.from(bot.guilds.values())}`);
      //bot.settings.set('528197859854647299', bot.defaultSettings);
      const wb = bot.settings.get('555159220777910273', "statusWebhook");
      if (wb && bot.mode == "live") {
          const embedOnline = new Discord.RichEmbed();
          embedOnline.setColor(0x00ff00);
          //embedOnline.setTitle("Oghmabot Online");
          embedOnline.setDescription(`Logged in to servers: ${Array.from(bot.guilds.values())}`);
          const wbClient = new Discord.WebhookClient(wb.id, wb.token);
          wbClient.name = "Oghmabot Online";
          wbClient.send("",embedOnline);
      }
    });
    bot.on('message', msg => {
      if(msg.author.id === bot.user.id) return;

      if(msg.guild) {
        // This section may refer to guild-customized content
      }
    });

    bot.on('guildCreate', guild => {
      if(!bot.settings.has(guild.id)) {
        bot.settings.set(guild.id, bot.defaultSettings);
      }
    });

    bot.on("guildDelete", guild => {
      // When the bot leaves or is kicked, delete settings and webhooks to prevent stale entries.
      //bot.webhooks.delete(guild.id);
    });
  }
}
