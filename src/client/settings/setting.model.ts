import { DataTypes, Model, Sequelize } from 'sequelize';

export type Settings = Record<string, string>;

export interface Setting {
  guildId: string;
  channelId?: string;
  settings: Settings;
}

export class SettingModel extends Model<Setting> {
  public static initialize(sequelize: Sequelize): SettingModel {
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
}
