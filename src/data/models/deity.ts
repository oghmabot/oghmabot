import { EmbedFieldData, MessageEmbed } from "discord.js";
import { DataTypes, FindOptions, Model, Sequelize } from "sequelize";
import { findBestStringMatch, getOghmabotEmbed } from "../../utils";
import { ArelithWikiScraper, FandomApiArticle, FandomApiProxy, FandomSubdomain } from "../proxies";

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
  fandomFRCormyrAbstract?: string;
  fandomFRCormyrId?: number;
  fandomFRCormyrUrl?: string;
  fandomFRCormyrThumbnail?: string;
  thumbnail?: string;
  pronunciation?: string;
}

export class DeityModel extends Model<Deity> {
  static initialize(sequelize: Sequelize): DeityModel {
    return this.init({
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      powerLevel: DataTypes.STRING,
      symbol: DataTypes.STRING,
      titles: DataTypes.ARRAY(DataTypes.STRING),
      alignment: DataTypes.STRING,
      clergyAlignments: DataTypes.ARRAY(DataTypes.STRING),
      portfolio: DataTypes.ARRAY(DataTypes.STRING),
      worshippers: DataTypes.ARRAY(DataTypes.STRING),
      domains: DataTypes.ARRAY(DataTypes.STRING),
      dogma: DataTypes.STRING,
      arelithAspects: DataTypes.ARRAY(DataTypes.STRING),
      arelithCategory: DataTypes.STRING,
      arelithClergyAlignments: DataTypes.ARRAY(DataTypes.STRING),
      arelithWikiUrl: DataTypes.STRING,
      fandomFRAbstract: DataTypes.STRING,
      fandomFRId: {
        type: DataTypes.INTEGER,
        unique: true,
      },
      fandomFRUrl: DataTypes.STRING,
      fandomFRThumbnail: DataTypes.STRING,
      fandomFRCormyrId: {
        type: DataTypes.STRING,
        unique: true,
      },
      fandomFRCormyrUrl: DataTypes.STRING,
      fandomFRCormyrThumbnail: DataTypes.STRING,
      thumbnail: DataTypes.STRING,
      pronunciation: DataTypes.STRING,
    }, {
      sequelize,
      modelName: 'deity',
      tableName: 'deities',
    });
  }

  static addDeity = async (deity: Deity): Promise<DeityModel> => await DeityModel.create(deity);

  static getOrAddDeity = async (deityQuery: string): Promise<Deity | undefined> => {
    const deities = await DeityModel.getDeities();
    const foundDeity = findBestStringMatch(deities, deityQuery, d => d.name);
    if (foundDeity) return foundDeity;

    const newDeity = await ArelithWikiScraper.fetchDeity(deityQuery);
    if (newDeity) {
      const frDeity = await FandomApiProxy.fetchDeityDetails(newDeity.name, FandomSubdomain.ForgottenRealms, DeityModel);
      const frcDeity = await FandomApiProxy.fetchDeityDetails(frDeity?.name ?? newDeity.name, FandomSubdomain.FRC, DeityModel);
      const deity = { ...frDeity, ...frcDeity, ...newDeity };
      await DeityModel.addDeity(deity);
      return deity;
    }
  }

  static getDeities = async (options?: FindOptions): Promise<Deity[]> => {
    const deities = await DeityModel.findAll({
      order: ['name'],
      ...options,
    });
    return deities.map(d => d.get());
  }

  static fromFandomApiArticle = (article: FandomApiArticle, subdomain: FandomSubdomain): Partial<Deity> => {
    const { title, abstract, id, url, thumbnail } = article;
    const parsedThumbnail = thumbnail.substring(0, thumbnail.indexOf('revision'));

    if (subdomain === FandomSubdomain.ForgottenRealms) {
      return {
        name: title,
        fandomFRAbstract: abstract.replace(/\s*?[(]pronounced:.*[)]/, '').match(/^.*?[.]/)?.join(),
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
        pronunciation: abstract.substring(abstract.indexOf(title) + title.length + 1).match(/^[(](.+?)[)]/)?.slice(1, 2)[0],
      };
    }

    return {};
  };

  static toEmbed = (deity: Deity): MessageEmbed => {
    const { name, titles, arelithWikiUrl, fandomFRThumbnail, fandomFRCormyrThumbnail, thumbnail, pronunciation } = deity;
    const embed = getOghmabotEmbed();

    embed.setTitle(pronunciation ? `${name} (${pronunciation})` : name);
    embed.setDescription(`*${titles && titles.join(', ')}*`);
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

    embed.addFields(DeityModel.getFields(deity));
    return embed;
  }

  private static getFields = (deity: Deity): EmbedFieldData[] => {
    const { alignment, arelithClergyAlignments, powerLevel, arelithAspects, dogma, fandomFRAbstract } = deity;
    const fields: EmbedFieldData[] = [];

    if (alignment) {
      fields.push({ name: 'Alignment', value: alignment, inline: !!(powerLevel || arelithClergyAlignments) });
    }

    if (powerLevel) {
      fields.push({ name: 'Power Level', value: powerLevel, inline: !!alignment });
    }

    if (arelithClergyAlignments) {
      fields.push({ name: 'Clergy Alignments', value: arelithClergyAlignments.join(', '), inline: !!alignment && !powerLevel });
    }

    if (arelithAspects) {
      fields.push({ name: 'Aspects', value: arelithAspects.join(', ') });
    }

    const infoField = DeityModel.getInfoFieldString(deity);
    if (infoField) {
      fields.push({ name: ':book:', value: infoField });
    }

    if (dogma) {
      fields.push({ name: 'Dogma', value: dogma });
    } else if (fandomFRAbstract) {
      fields.push({ name: 'The Forgotten Realms Wiki', value: fandomFRAbstract });
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