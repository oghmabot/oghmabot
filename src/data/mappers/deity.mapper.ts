import { FandomApiArticle, FandomSubdomain } from '../proxies';
import { EmbedFieldData, MessageEmbed } from 'discord.js';
import { getUntilLastWithin } from '../../utils';
import { Deity, getAlignmentAbbreviation, getAlignmentName } from '../models';
import { OghmabotEmbed } from '../../client';

export class DeityMapper {
  static fromFandomApiArticle(article: FandomApiArticle, subdomain: FandomSubdomain): Deity | undefined {
    const { title, abstract, id, url, thumbnail } = article;
    const parsedThumbnail = thumbnail?.substring(0, thumbnail.indexOf('revision'));

    if (subdomain === FandomSubdomain.ForgottenRealms) {
      return {
        name: title,
        fandomFRAbstract: abstract?.replace(/\s*?[(]pronounced:.*[)]/, ''),
        fandomFRId: id,
        fandomFRUrl: url,
        fandomFRThumbnail: parsedThumbnail,
      };
    }

    if (subdomain === FandomSubdomain.FRC) {
      return {
        name: title,
        fandomFRCormyrId: id,
        fandomFRCormyrUrl: url,
        fandomFRCormyrThumbnail: parsedThumbnail,
        pronunciation: abstract?.substring(abstract?.indexOf(title) + title.length + 1).match(/^[(](.+?)[)]/)?.slice(1, 2)[0],
      };
    }
  }

  static toMessageEmbed = (deity: Deity): MessageEmbed => {
    const { name, titles, arelithWikiUrl, fandomFRThumbnail, fandomFRCormyrThumbnail, fandomTitles, thumbnail, pronunciation } = deity;
    const embed = new OghmabotEmbed();

    embed.setTitle(pronunciation ? `${name} (${pronunciation})` : name);
    if (fandomTitles) {
      embed.setDescription(`*${fandomTitles.join(', ')}*`);
    } else if (titles) {
      embed.setDescription(`*${titles.join(', ')}*`);
    }
    if (arelithWikiUrl) {
      embed.setURL(arelithWikiUrl);
    }

    if (thumbnail) {
      embed.setThumbnail(thumbnail);
    } else if (fandomFRCormyrThumbnail) {
      embed.setThumbnail(fandomFRCormyrThumbnail);
    } else if (fandomFRThumbnail) {
      embed.setThumbnail(fandomFRThumbnail);
    }

    embed.addFields(DeityMapper.getFields(deity));
    return embed;
  }

  private static getFields = (deity: Deity): EmbedFieldData[] => {
    const { alignment, arelithClergyAlignments, powerLevel, arelithAspects, dogma, fandomFRAbstract } = deity;
    const fields: EmbedFieldData[] = [];

    if (alignment) {
      fields.push({ name: 'Alignment', value: getAlignmentName(alignment), inline: !!(powerLevel || arelithClergyAlignments) });
    }

    if (powerLevel) {
      fields.push({ name: 'Power Level', value: powerLevel, inline: !!alignment });
    }

    if (arelithClergyAlignments) {
      fields.push({
        name: 'Clergy Alignments',
        value: arelithClergyAlignments.sort().map(getAlignmentAbbreviation).join(', '),
        inline: !!alignment && !powerLevel });
    }

    if (arelithAspects) {
      fields.push({ name: 'Aspects', value: arelithAspects.join(', ') });
    }

    const infoField = DeityMapper.getInfoFieldString(deity);
    if (infoField) {
      fields.push({ name: ':book:', value: infoField });
    }

    if (dogma) {
      fields.push({ name: 'Dogma', value: getUntilLastWithin(dogma, '.', 350) });
    } else if (fandomFRAbstract) {
      fields.push({ name: 'The Forgotten Realms Wiki', value: getUntilLastWithin(fandomFRAbstract, '.', 200) });
    }

    return fields;
  }

  private static getInfoFieldString = (deity: Deity): string => {
    const { symbol, portfolio, worshippers, domains } = deity;
    let result = '';
    if (symbol) result += `**Symbol:** ${symbol}\n`;
    if (portfolio?.length) result += `**Portfolio:** ${portfolio.join(', ')}\n`;
    if (worshippers?.length) result += `**Worshippers:** ${worshippers.join(', ')}\n`;
    if (domains?.length) result += `**Domains:** ${domains.join(', ')}\n`;
    return result;
  }
}
