'use strict';

var request = require('request-promise');
var cheerio = require('cheerio');
const Discord = require('discord.js');

const arelithPortalURL = 'http://portal.arelith.com/';

const arelithServers = ['Surface', 'Cities & Planes', 'Distant Shores'];
const arServerPictures = ["http://portal.arelith.com/images/surface_header.jpg", "http://portal.arelith.com/images/planes_header.jpg", "http://portal.arelith.com/images/distant_shores_header.jpg"];

module.exports =
{
	updateServerStatus: async function(client)
	{
        const statusCard = {};
        return new Promise((resolve,reject) => {
            request(arelithPortalURL).then(async function(html){
                var $ = cheerio.load(html);
                var i;
                var j;
                for ( i = 1; i <= 3; i++)
                {
                    if ( i == 3){
                        j = 8;
                    } // For whatever reason DS' id is 8 on the portal
                    else {
                        j = i;
                    }
                    var statusArray = await $('#portal-contents').find('.contents').find(`#list-${j}`).find(`#player-${j}-list`).find('thead').find('tr:nth-child(2)').find('td').text().split(' | ');
                    statusCard.name = arelithServers[i-1];
                    statusCard.state = statusArray[1]; 
                    statusCard.uptime = statusArray[2];
                    statusCard.population = statusArray[3];
                    statusCard.thumbnail = arServerPictures[i-1];
                    
                    switch (statusCard.state) {
                        case "Online":
                            statusCard.color = 0x00ff00;
                            break;
                        case "Offline":
                            statusCard.color = 0xff0000;
                            break;
                        default:
                            statusCard.color = 0xffcc00;
                    }
                    if (statusCard.state == "Online" && client.servers.get(i,'state') !== "Online")
                    {
                        const embedStatus = new Discord.RichEmbed();
                        embedStatus.setColor(statusCard.color);
                        embedStatus.setTitle(`${statusCard.name} is now online.`);
                        embedStatus.setURL(arelithPortalURL);
                        embedStatus.setFooter("Oghmabot","https://i.imgur.com/DBAtbUx.png");
                        embedStatus.setTimestamp();
                        embedStatus.setThumbnail(statusCard.thumbnail);
                        //let's send out the updates
                        const listOfGuildsWithWebhooks = client.settings.filter( guild => {
                            return guild.statusState && guild.statusWebhook.id && guild.statusWebhook.token;
                        }).keyArray();
                        listOfGuildsWithWebhooks.forEach( (guildid) => {
                            const wb = client.settings.get(guildid, "statusWebhook");
                            const wbClient = new Discord.WebhookClient(wb.id, wb.token);
                            wbClient.send("",embedStatus).then().catch(() => {client.settings.delete(guildid, "statusWebhook");});
                        });
                    }
                    if (statusCard.state !== "Online" && statusCard.state !=="Offline" && client.servers.get(i,'state') == "Online")
                    {
                        const embedStatus = new Discord.RichEmbed();
                        embedStatus.setColor(statusCard.color);
                        embedStatus.setTitle(`${statusCard.name} is now restarting.`);
                        embedStatus.setURL(arelithPortalURL);
                        embedStatus.setFooter("Oghmabot","https://i.imgur.com/DBAtbUx.png");
                        embedStatus.setTimestamp();
                        embedStatus.setThumbnail(statusCard.thumbnail);
                        //let's send out the updates
                        const listOfGuildsWithWebhooks = client.settings.filter( guild => {
                            return guild.statusState && guild.statusWebhook.id && guild.statusWebhook.token;
                        }).keyArray();
                        listOfGuildsWithWebhooks.forEach( (guildid) => {
                            const wb = client.settings.get(guildid, "statusWebhook");
                            const wbClient = new Discord.WebhookClient(wb.id, wb.token);
                            wbClient.send("",embedStatus).then().catch(() => {client.settings.delete(guildid, "statusWebhook");});
                        }); 
                    }
                    client.servers.set(i, statusCard);
                }
            });
        });
	},
}