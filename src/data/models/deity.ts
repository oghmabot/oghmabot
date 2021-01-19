import { DataTypes, Model, Sequelize } from "sequelize/types";

export interface Deity {
  url: string;
  name: string;
  titles?: string[];
  alignment?: string;
  clergy_alignments?: string[];
  portfolio?: string[];
  worshipers?: string[];
  domains?: string[];
  dogma?: string;
  ar_aspects?: string[];
  ar_category?: string;
}

export class DeityModel extends Model<Deity> {
  static initialize(sequelize: Sequelize): DeityModel {
    return this.init({
      url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      titles: DataTypes.ARRAY(DataTypes.STRING),
      alignment: DataTypes.STRING,
      clergy_alignments: DataTypes.STRING,
      portfolio: DataTypes.ARRAY(DataTypes.STRING),
      worshipers: DataTypes.ARRAY(DataTypes.STRING),
      domains: DataTypes.ARRAY(DataTypes.STRING),
      dogma: DataTypes.STRING,
      ar_aspects: DataTypes.ARRAY(DataTypes.STRING),
      ar_category: DataTypes.STRING,
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
}