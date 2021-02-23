import { DataTypes, FindOptions, Model, Sequelize } from 'sequelize';

export type Settings = Record<string, boolean | number | string>;

export interface Setting {
  guildId: string;
  channelId?: string;
  settings: Settings;
}

export class SettingModel extends Model<Setting> {
  static initialize(sequelize: Sequelize): SettingModel {
    return this.init({
      guildId: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      channelId: {
        type: DataTypes.STRING,
        primaryKey: true,
        defaultValue: '',
      },
      settings: DataTypes.JSON,
    }, {
      sequelize,
      modelName: 'setting',
    });
  }

  static async getAll(options?: FindOptions): Promise<Setting[]> {
    return (await this.findAll(options))?.map(s => s.get());
  }
}
