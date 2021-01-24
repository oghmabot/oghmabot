import { DataTypes, FindOptions, Model, Sequelize } from 'sequelize';
import { findBestStringMatch } from '../../utils';
import { fetchAllDeities, fetchDeity } from '../proxies';

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
  fandomTitles?: string[];
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
      dogma: DataTypes.TEXT,
      arelithAspects: DataTypes.ARRAY(DataTypes.STRING),
      arelithCategory: DataTypes.STRING,
      arelithClergyAlignments: DataTypes.ARRAY(DataTypes.STRING),
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

    const deity = await fetchDeity(deityQuery);
    if (deity) {
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
}