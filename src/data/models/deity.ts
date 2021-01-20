import { DataTypes, Model, Sequelize } from "sequelize";
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
  ar_abstract?: boolean;
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
      ar_abstract: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
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

  static fromFandomApiDeityObj = (el: FandomApiDeityObj): Deity => (
    {
      name: el.title,
      fandom_fr_id: el.id,
      fandom_fr_url: el.url,
      pronunciation: el.abstract.substr(el.abstract.indexOf('(pronounced:') + 12, el.abstract.indexOf('listen') - 12 - el.abstract.indexOf('(pronounced:')).replace(/[0-9]+/g, '').split(' or:'),
      thumbnail: el.thumbnail.substring(0, el.thumbnail.indexOf('revision')),
    }
  );

  static addDeity = async (deity: Deity): Promise<DeityModel> => await DeityModel.create(deity);

  static getDeityByName = async (name: string): Promise<Deity | undefined> => (await DeityModel.findOne({
    where: { name },
  }))?.get();
}