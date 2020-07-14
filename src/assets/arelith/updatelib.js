'use strict';

var request = require('request-promise');
var cheerio = require('cheerio');
const Discord = require('discord.js');
let Parser = require('rss-parser');
let textVersion = require('textversionjs');
let parser = new Parser();

var styleConfig = {
  imgProcess: function () {
    return '';
  },
  listIndentionTabs: 1
};


const arelithForumURL = 'http://forum.arelith.com';
const arelithUpdateThreadURL = 'http://forum.arelith.com/viewtopic.php?f=23&t=25&start=9999';
const steamNWNEEAnnouncementRSS = 'http://steamcommunity.com/games/704450/rss/';


module.exports =
{
  getLastUpdate: getLastARUpdate,

  getLastAnnouncement: getLastARAnnouncement,

  getLastNWNUpdate: getLastNWNUpdate,

  checkForUpdate: async function (client) {
    const updateCard = await getLastARUpdate();
    const announcementCard = await getLastARAnnouncement();
    const steamNWNCard = await getLastNWNUpdate();
    const lastSavedUpdateURL = client.updates.get('lastARUpdate');
    const lastSavedARAnnouncementURL = client.updates.get('lastARAnnouncement');
    const lastSavedNWNAnnouncementURL = client.updates.get('lastNWNAnnouncement');

    getLastNWNUpdate();

    if (updateCard.url !== lastSavedUpdateURL) {
      const embedUpdate = new Discord.RichEmbed();
      embedUpdate.setColor(0xffffff);
      embedUpdate.setTitle('New Arelith Update');
      embedUpdate.setURL(updateCard.url);
      var contentAdjusted = (updateCard.content.length > 2048) ? updateCard.content.slice(0, 2045) + '...' : updateCard.content;
      embedUpdate.setDescription(contentAdjusted);
      embedUpdate.setFooter('Oghmabot', 'https://i.imgur.com/DBAtbUx.png');
      embedUpdate.setTimestamp();
      embedUpdate.setThumbnail('https://i.imgur.com/QJ4lnPJ.png');
      //let's send out the updates
      const listOfGuildsWithWebhooks = client.settings.filter(guild => {
        return guild.announcementsState && guild.announcementsWebhook.id && guild.announcementsWebhook.token;
      }).keyArray();
      listOfGuildsWithWebhooks.forEach((guildid) => {
        const wb = client.settings.get(guildid, 'announcementsWebhook');
        const wbClient = new Discord.WebhookClient(wb.id, wb.token);
        wbClient.send('', embedUpdate).then().catch(() => { client.settings.delete(guildid, 'announcementsWebhook'); });
      });
      await client.updates.set('lastARUpdate', updateCard.url);
    }
    if (announcementCard.url !== lastSavedARAnnouncementURL && announcementCard.url.match(/(?<=#p)(\d*)/)[1] !== updateCard.url.match(/(?<=#p)(\d*)/)[1]) {
      const embedAnnouncement = new Discord.RichEmbed();
      embedAnnouncement.setColor(0xffffff);
      embedAnnouncement.setTitle('New Arelith Announcement');
      embedAnnouncement.setURL(announcementCard.url);
      var contentAdjusted = ((announcementCard.title.length + announcementCard.content.length) > 2046) ? `**${announcementCard.title}**\n${announcementCard.content}`.slice(0, 2045) + '...' : `**${announcementCard.title}**\n${announcementCard.content}`;
      embedAnnouncement.setDescription(contentAdjusted);
      //embedAnnouncement.addField(announcementCard.title,announcementCard.content);
      embedAnnouncement.setFooter('Oghmabot', 'https://i.imgur.com/DBAtbUx.png');
      embedAnnouncement.setTimestamp();
      embedAnnouncement.setThumbnail('https://i.imgur.com/QJ4lnPJ.png');
      //let's send out the updates
      const listOfGuildsWithWebhooks = client.settings.filter(guild => {
        return guild.announcementsState && guild.announcementsWebhook.id && guild.announcementsWebhook.token;
      }).keyArray();
      listOfGuildsWithWebhooks.forEach((guildid) => {
        const wb = client.settings.get(guildid, 'announcementsWebhook');
        const wbClient = new Discord.WebhookClient(wb.id, wb.token);
        wbClient.send('', embedAnnouncement).then().catch(() => { client.settings.delete(guildid, 'announcementsWebhook'); });
      });
      client.updates.set('lastARAnnouncement', announcementCard.url);
    }
    if (steamNWNCard.url !== lastSavedNWNAnnouncementURL) {
      const embedAnnouncement = new Discord.RichEmbed();
      embedAnnouncement.setColor(0xffffff);
      embedAnnouncement.setTitle('New NWN:EE Announcement');
      embedAnnouncement.setURL(steamNWNCard.url);
      var contentAdjusted = ((steamNWNCard.title.length + steamNWNCard.content.length) > 2046) ? `**${steamNWNCard.title}**\n${steamNWNCard.content}`.slice(0, 2045) + '...' : `**${steamNWNCard.title}**\n${steamNWNCard.content}`;
      embedAnnouncement.setDescription(contentAdjusted);
      //embedAnnouncement.addField(steamNWNCard.title,steamNWNCard.content);
      embedAnnouncement.setFooter('Oghmabot', 'https://i.imgur.com/DBAtbUx.png');
      embedAnnouncement.setTimestamp();
      embedAnnouncement.setThumbnail('https://i.imgur.com/CJvTuCk.png');
      //let's send out the updates
      const listOfGuildsWithWebhooks = client.settings.filter(guild => {
        return guild.announcementsState && guild.announcementsWebhook.id && guild.announcementsWebhook.token;
      }).keyArray();
      listOfGuildsWithWebhooks.forEach((guildid) => {
        const wb = client.settings.get(guildid, 'announcementsWebhook');
        const wbClient = new Discord.WebhookClient(wb.id, wb.token);
        wbClient.send('', embedAnnouncement).then().catch(() => { client.settings.delete(guildid, 'announcementsWebhook'); });
      });
      client.updates.set('lastNWNAnnouncement', steamNWNCard.url);
    }
  }
};
function getLastARUpdate() {

  var updateCard = {};
  return new Promise((resolve) => {
    request(arelithUpdateThreadURL).then(function (html) {
      var $ = cheerio.load(html);
      var lastUpdate = $('#page-body').children('.post').last().find('.inner').find('.postbody').find('div');
      updateCard.url = arelithForumURL + lastUpdate.find('.author').find('.unread').attr('href').slice(1).replace(/&sid.*(?=#)/g, '');
      updateCard.content = lastUpdate.find('.content').text().trim();

      resolve(updateCard);
    });
  });
}


function getLastARAnnouncement() {

  var announcementCard = {};
  return new Promise((resolve, reject) => {
    request(arelithForumURL).then(function (html) {
      var $ = cheerio.load(html);
      var lastAnnouncementURL = $('#page-body').find('div:nth-child(2)').find('div').find('.forums').children('li').first().find('.lastpost').find('a').attr('href').slice(1).replace(/&sid.*(?=#)/g, '');
      announcementCard.url = arelithForumURL + lastAnnouncementURL;

      request(announcementCard.url).then(function (html) {
        var $ = cheerio.load(html);
        var postID = `#post_content${announcementCard.url.match(/(?<=#p)(\d*)/)[1]}`;
        announcementCard.title = $(postID).find('h3').text();
        announcementCard.author = $(postID).find('.username-coloured').text();
        announcementCard.content = $(postID).find('.content').text().trim();
        resolve(announcementCard);
      });
    });
  });
}

async function getLastNWNUpdate() {
  var steamNWNCard = {};
  return new Promise(async (resolve, reject) => {
    let nwnFeed = await parser.parseURL(steamNWNEEAnnouncementRSS);

    steamNWNCard.url = nwnFeed.items[0].guid;
    steamNWNCard.title = nwnFeed.items[0].title;
    steamNWNCard.content = textVersion(nwnFeed.items[0].content, styleConfig);

    resolve(steamNWNCard);
  });
}