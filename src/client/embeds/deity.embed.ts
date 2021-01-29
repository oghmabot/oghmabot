import { EmbedFieldData } from 'discord.js';
import { Deity, getAlignmentAbbreviation, getAlignmentName } from '../../data/models';
import { getUntilLastWithin } from '../../utils';
import { OghmabotEmbed } from './oghmabot.embed';

export class DeityEmbed extends OghmabotEmbed {
  private deity;

  constructor(deity: Deity) {
    super();
    this.deity = deity;

    const { name, titles, arelithWikiUrl, fandomFRThumbnail, fandomFRCormyrThumbnail, fandomTitles, thumbnail, pronunciation } = deity;
    this.setTitle(pronunciation ? `${name} (${pronunciation})` : name);
    if (fandomTitles) {
      this.setDescription(`*${fandomTitles.join(', ')}*`);
    } else if (titles) {
      this.setDescription(`*${titles.join(', ')}*`);
    }
    if (arelithWikiUrl) {
      this.setURL(arelithWikiUrl);
    }

    if (thumbnail) {
      this.setThumbnail(thumbnail);
    } else if (fandomFRCormyrThumbnail) {
      this.setThumbnail(fandomFRCormyrThumbnail);
    } else if (fandomFRThumbnail) {
      this.setThumbnail(fandomFRThumbnail);
    }

    this.setFields();
  }

  private setFields() {
    const { alignment, arelithClergyAlignments, powerLevel, arelithAspects, dogma, fandomFRAbstract } = this.deity;
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

    const infoField = this.getInfoFieldString();
    if (infoField) {
      fields.push({ name: ':book:', value: infoField });
    }

    if (dogma) {
      fields.push({ name: 'Dogma', value: getUntilLastWithin(dogma, '.', 350) });
    } else if (fandomFRAbstract) {
      fields.push({ name: 'The Forgotten Realms Wiki', value: getUntilLastWithin(fandomFRAbstract, '.', 200) });
    }

    this.addFields(fields);
  }

  private getInfoFieldString(): string {
    const { symbol, portfolio, worshippers, domains } = this.deity;
    let result = '';
    if (symbol) result += `**Symbol:** ${symbol}\n`;
    if (portfolio?.length) result += `**Portfolio:** ${portfolio.join(', ')}\n`;
    if (worshippers?.length) result += `**Worshippers:** ${worshippers.join(', ')}\n`;
    if (domains?.length) result += `**Domains:** ${domains.join(', ')}\n`;
    return result;
  }
}
