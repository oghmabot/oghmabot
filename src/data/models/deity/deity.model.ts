import { DataTypes, FindOptions, Model, Sequelize } from 'sequelize';
import { findBestStringMatch, stripParenthesis } from '../../../utils';
import { fetchAllDeities, fetchDeity } from '../../proxies';
import { Alignment } from '../alignment';
import { DeityCategory } from './category.model';

export interface Deity {
  name: string;
  powerLevel?: string;
  symbol?: string;
  titles?: string[];
  alignment?: Alignment;
  clergyAlignments?: Alignment[];
  portfolio?: string[];
  worshippers?: string[];
  domains?: string[];
  dogma?: string;
  arelithAspects?: string[];
  arelithCategory?: DeityCategory;
  arelithClergyAlignments?: Alignment[];
  arelithWikiUrl?: string;
  fandomFRAbstract?: string;
  fandomFRId?: number;
  fandomFRUrl?: string;
  fandomFRThumbnail?: string;
  fandomFRCormyrAbstract?: string;
  fandomFRCormyrId?: number;
  fandomFRCormyrUrl?: string;
  fandomFRCormyrThumbnail?: string;
  fandomTitles?: string[];
  thumbnail?: string;
  pronunciations?: string[];
  synergies?: string[];
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
      alignment: DataTypes.INTEGER,
      clergyAlignments: DataTypes.ARRAY(DataTypes.INTEGER),
      portfolio: DataTypes.ARRAY(DataTypes.STRING),
      worshippers: DataTypes.ARRAY(DataTypes.STRING),
      domains: DataTypes.ARRAY(DataTypes.STRING),
      dogma: DataTypes.TEXT,
      arelithAspects: DataTypes.ARRAY(DataTypes.STRING),
      arelithCategory: DataTypes.INTEGER,
      arelithClergyAlignments: DataTypes.ARRAY(DataTypes.INTEGER),
      arelithWikiUrl: DataTypes.STRING,
      fandomFRAbstract: DataTypes.TEXT,
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
      fandomTitles: DataTypes.ARRAY(DataTypes.STRING),
      thumbnail: DataTypes.STRING,
      pronunciations: DataTypes.ARRAY(DataTypes.STRING),
      synergies: DataTypes.ARRAY(DataTypes.STRING),
    }, {
      sequelize,
      modelName: 'deity',
      tableName: 'deities',
    });
  }

  static async reset(sequelize: Sequelize, force: boolean = true, insertData: boolean = true): Promise<void> {
    try {
      const deities = insertData ? await fetchAllDeities() : [];
      if (insertData && !deities.length) throw new Error('No deities found.');

      DeityModel.initialize(sequelize);
      await DeityModel.sync({ force });
      deities.forEach(DeityModel.add);
    } catch (error) {
      console.error('[DeityModel] Unexpected error while resetting.', error);
      throw error;
    }
  }

  static add = async (deity: Deity): Promise<DeityModel> => await DeityModel.create(deity);

  static async fetch(deityQuery: string): Promise<Deity | undefined> {
    const deities = await DeityModel.getDeities();
    const foundDeity = findBestStringMatch(deities, deityQuery, d => stripParenthesis(d.name));
    if (foundDeity) return foundDeity;

    const deity = await fetchDeity(deityQuery);
    if (deity) {
      await DeityModel.add(deity);
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
}
