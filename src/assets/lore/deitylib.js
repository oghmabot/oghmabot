'use strict';

var request = require('request-promise');
var cheerio = require('cheerio');

const arWikiDeityTable = 'http://wiki.arelith.com/Deity_Table';
const arWikiURL = 'http://wiki.arelith.com';
const frWikiURL = 'https://forgottenrealms.fandom.com/wiki';
const frcWikiURL = 'https://frc.fandom.com/wiki'; 

module.exports =
{
  findDeity: function(deity)
  {
    var deityCard = {};
    return new Promise((resolve,reject) => {
            
            
      request(arWikiDeityTable).then(function(html){
        var $ = cheerio.load(html);
        $('tbody').find('tr').each(function(){
          var deityBuffer = $(this).find('a').text();
          if (deityBuffer.toLowerCase().replace(/\s+/g,'') == deity.toLowerCase().replace(/\s+/g,''))
          {

            deityCard.name = deityBuffer;
            deityCard.url = $(this).find('td:nth-child(1) a').attr('href');
            deityCard.primaryAspect = $(this).find('td:nth-child(3)').text().trim();
            deityCard.secondaryAspect = $(this).find('td:nth-child(4)').text().trim();
          }
        });
        if (!deityCard.name)
        {
          return resolve(deityCard);
        }
        request(arWikiURL + deityCard.url).then(function (html) {
          var $ = cheerio.load(html);
          if (deityCard.name.indexOf('Abyss') !== -1)
          {
            deityCard.titles = 'The Abyss';
            deityCard.alignment = 'Chaotic Evil';
            deityCard.clergyAlignments = 'CN, CE, NE';
            deityCard.url = '/Abyss';

          }
          if (deityCard.name.indexOf('Toril') !== -1)
          {
            deityCard.titles = 'Abeir-Toril';
            deityCard.alignment = 'No Alignment';
            deityCard.clergyAlignments = 'N/A';
            deityCard.thumbnail = 'https://vignette.wikia.nocookie.net/forgottenrealms/images/7/71/Toril-globe-small.jpg/revision/latest?cb=20180122033701';
          }
          else {
            deityCard.titles  = $('dl').find('dd').find('i').text().trim();
            deityCard.symbol = $('tbody').find('tr:nth-child(2)').find('td:nth-child(2)').text().trim().replace(/\n.*/g,'');
            deityCard.alignment = $('tbody').find('tr:nth-child(3)').find('td:nth-child(2)').text().trim();
            deityCard.portfolio = $('tbody').find('tr:nth-child(4)').find('td:nth-child(2)').text().trim();
            deityCard.worshipers = $('tbody').find('tr:nth-child(5)').find('td:nth-child(2)').text().trim();
            deityCard.domains = $('tbody').find('tr:nth-child(6)').find('td:nth-child(2)').text().trim().replace(/ *\[[^\]]*]/g, '');
            deityCard.clergyAlignments = $('tbody').find('tr:nth-child(7)').find('td:nth-child(2)').text().trim();
          }
                    
          request(frWikiURL + deityCard.url).then(function (html) {
            var $ = cheerio.load(html);
            var titles = $('aside').find('section:nth-child(4)').find('div:nth-child(2)').find('div')[0].children;
            if (titles){
              var titlesBuffer = [];
              for (var key in titles)
              {
                if (titles[key].type == 'text' && titles[key].data.trim() !== '')
                {
                  titlesBuffer.push(titles[key].data.trim().replace(/[,]$/,''));
                }
              }
              titlesBuffer = titlesBuffer.join(', ');
              if (deityCard.titles.length < titlesBuffer.length)
              {
                deityCard.titles = titlesBuffer;
              }
            }                            
            request(frcWikiURL + deityCard.url).then(function (html) {
              var $ = cheerio.load(html);
              deityCard.thumbnail = $('table').find('tbody').find('tr:nth-child(2)').find('td').find('a').find('img').attr('data-src');
              $('h2').each(function(){
                if ($(this).find('span:nth-child(1)').text().trim() == 'Dogma')
                {
                  deityCard.dogma = $(this).next('p').text().trim();
                }
              });
              resolve(deityCard);
            }).catch(function (err) {
              resolve(deityCard);
            });            
          }).catch(function (err) {
            resolve(deityCard);
          }); 
        }).catch(function (err) {
          resolve(deityCard);
        });    
      }).catch(function (err) {
        resolve(deityCard);
      });
    });
  },

};