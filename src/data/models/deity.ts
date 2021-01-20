import { MessageEmbed } from "discord.js";
import { DataTypes, Model, Sequelize } from "sequelize";
import { getOghmabotEmbed } from "../../utils";
import { FandomApiDeityObj } from "../proxy";

export interface Deity {
  name: string;
  power_level?: string;
  symbol?: string;
  titles?: string[];
  alignment?: string;
  clergy_alignments?: string[];
  portfolio?: string[];
  worshippers?: string[];
  domains?: string[];
  dogma?: string;
  ar_aspects?: string[];
  ar_category?: string;
  ar_clergy_alignments?: string[];
  ar_wiki_url?: string;
  fandom_fr_id?: number;
  fandom_fr_url?: string;
  pronunciation?: string[];
  thumbnail?: string;
}

export class DeityModel extends Model<Deity> {
  static initialize(sequelize: Sequelize): DeityModel {
    return this.init({
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      power_level: DataTypes.STRING,
      symbol: DataTypes.STRING,
      titles: DataTypes.ARRAY(DataTypes.STRING),
      alignment: DataTypes.STRING,
      clergy_alignments: DataTypes.STRING,
      portfolio: DataTypes.ARRAY(DataTypes.STRING),
      worshippers: DataTypes.ARRAY(DataTypes.STRING),
      domains: DataTypes.ARRAY(DataTypes.STRING),
      dogma: DataTypes.STRING,
      ar_aspects: DataTypes.ARRAY(DataTypes.STRING),
      ar_category: DataTypes.STRING,
      ar_clergy_alignments: DataTypes.ARRAY(DataTypes.STRING),
      ar_wiki_url: DataTypes.STRING,
      fandom_fr_id: DataTypes.INTEGER,
      fandom_fr_url: DataTypes.STRING,
      pronunciation: DataTypes.ARRAY(DataTypes.STRING),
      thumbnail: DataTypes.STRING,
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

  static fromFandomApiDeityObj = (el: FandomApiDeityObj): Deity => (
    {
      name: el.title,
      fandom_fr_id: el.id,
      fandom_fr_url: el.url,
      pronunciation: el.abstract.substr(el.abstract.indexOf('(pronounced:') + 12, el.abstract.indexOf('listen') - 12 - el.abstract.indexOf('(pronounced:')).replace(/[0-9]+/g, '').split(' or:'),
      thumbnail: el.thumbnail.substring(0, el.thumbnail.indexOf('revision')),
    }
  );

  static toEmbed = (deity: Deity): MessageEmbed => {
    const { name, power_level, titles, alignment, dogma, ar_aspects, ar_clergy_alignments, ar_wiki_url, thumbnail } = deity;
    const embed = getOghmabotEmbed();
    embed.setTitle(name);
    embed.setDescription(`*${titles && titles.join(', ')}*`);
    if (ar_wiki_url) embed.setURL(ar_wiki_url);
    if (thumbnail) embed.setThumbnail(thumbnail);

    if (alignment) embed.addField('Alignment', alignment, !!(ar_clergy_alignments || power_level));
    if (ar_clergy_alignments?.length) embed.addField('Clergy Alignments', ar_clergy_alignments.join(', '), !!alignment);
    if (power_level) embed.addField('Power Level', power_level, !!alignment && !ar_clergy_alignments);
    if (ar_aspects?.length) embed.addField('Aspects', ar_aspects.join(', '));
    const infoField = DeityModel.getInfoFieldString(deity);
    if (infoField) embed.addField(':book:', infoField);
    if (dogma) embed.addField('Dogma', dogma);

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