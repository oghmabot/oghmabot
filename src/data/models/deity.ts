import { MessageEmbed } from "discord.js";
import { DataTypes, Model, Sequelize } from "sequelize";
import { getOghmabotEmbed } from "../../utils";
import { FandomApiArticle } from "../proxies";

export interface Deity {
  name: string;
  powerLevel?: string;
  symbol?: string;
  titles?: string[];
  alignment?: string;
  clergyAlignments?: string[];
  portfolio?: string[];
  worshippers?: string[];
  domains?: string[];
  dogma?: string;
  arelithAspects?: string[];
  arelithCategory?: string;
  arelithClergyAlignments?: string[];
  arelithWikiUrl?: string;
  fandomFRAbstract?: string;
  fandomFRId?: number;
  fandomFRUrl?: string;
  fandomFRThumbnail?: string;
  pronunciation?: string[];
}

export class DeityModel extends Model<Deity> {
  static initialize(sequelize: Sequelize): DeityModel {
    return this.init({
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      powerLevel: DataTypes.STRING,
      symbol: DataTypes.STRING,
      titles: DataTypes.ARRAY(DataTypes.STRING),
      alignment: DataTypes.STRING,
      clergyAlignments: DataTypes.STRING,
      portfolio: DataTypes.ARRAY(DataTypes.STRING),
      worshippers: DataTypes.ARRAY(DataTypes.STRING),
      domains: DataTypes.ARRAY(DataTypes.STRING),
      dogma: DataTypes.STRING,
      arelithAspects: DataTypes.ARRAY(DataTypes.STRING),
      arelithCategory: DataTypes.STRING,
      arelithClergyAlignments: DataTypes.ARRAY(DataTypes.STRING),
      arelithWikiUrl: DataTypes.STRING,
      fandomFRAbstract: DataTypes.STRING,
      fandomFRId: DataTypes.INTEGER,
      fandomFRUrl: DataTypes.STRING,
      fandomFRThumbnail: DataTypes.STRING,
      pronunciation: DataTypes.ARRAY(DataTypes.STRING),
    }, {
      sequelize,
      modelName: 'deity',
      tableName: 'deities',
    });
  }

  static addDeity = async (deity: Deity): Promise<DeityModel> => await DeityModel.create(deity);

  static getDeityByName = async (name: string): Promise<Deity | undefined> => (await DeityModel.findOne({
    where: { name },
  }))?.get();

  static fromFandomApiArticle = (el: FandomApiArticle): Deity => (
    {
      name: el.title,
      fandomFRAbstract: el.abstract.replace(/\s*?[(]pronounced:.*[)]/, '').match(/^.*?[.]/)?.join(),
      fandomFRId: el.id,
      fandomFRUrl: el.url,
      fandomFRThumbnail: el.thumbnail.substring(0, el.thumbnail.indexOf('revision')),
      pronunciation: el.abstract.substr(el.abstract.indexOf('(pronounced:') + 12, el.abstract.indexOf('listen') - 12 - el.abstract.indexOf('(pronounced:')).replace(/[0-9]+/g, '').split(' or:'),
    }
  );

  static toEmbed = (deity: Deity): MessageEmbed => {
    const { name, powerLevel, titles, alignment, fandomFRAbstract, arelithAspects, arelithClergyAlignments, arelithWikiUrl, fandomFRThumbnail } = deity;
    const embed = getOghmabotEmbed();
    embed.setTitle(name);
    embed.setDescription(`*${titles && titles.join(', ')}*`);
    if (arelithWikiUrl) embed.setURL(arelithWikiUrl);
    if (fandomFRThumbnail) embed.setThumbnail(fandomFRThumbnail);

    if (alignment) embed.addField('Alignment', alignment, !!(arelithClergyAlignments || powerLevel));
    if (arelithClergyAlignments?.length) embed.addField('Clergy Alignments', arelithClergyAlignments.join(', '), !!alignment);
    if (powerLevel) embed.addField('Power Level', powerLevel, !!alignment && !arelithClergyAlignments);
    if (arelithAspects?.length) embed.addField('Aspects', arelithAspects.join(', '));
    const infoField = DeityModel.getInfoFieldString(deity);
    if (infoField) embed.addField(':book:', infoField);
    if (fandomFRAbstract) embed.addField('The Forgotten Realms Wiki', fandomFRAbstract);

    return embed;
  }

  static getInfoFieldString = (deity: Deity): string => {
    const { symbol, portfolio, worshippers, domains } = deity;
    let result = '';
    if (symbol) result += `**Symbol:** ${symbol}\n`;
    if (portfolio?.length) result += `**Portfolio:** ${portfolio.join(', ')}\n`;
    if (worshippers?.length) result += `**Worshippers:** ${worshippers.join(', ')}\n`;
    if (domains?.length) result += `**Domains:** ${domains.join(', ')}\n`;
    return result;
  }
}