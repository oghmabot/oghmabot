import { CommandoMessage } from 'discord.js-commando';
import { DataTypes, Model, Sequelize } from 'sequelize';

export interface MessageExpiry {
  id: string;
  expires: Date;
}

export class MessageExpiryModel extends Model<MessageExpiry> {
  static initialize(sequelize: Sequelize): MessageExpiryModel {
    return this.init({
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      expires: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    }, {
      sequelize,
      modelName: 'messageExpiry',
    });
  }

  static async setExpiry(msg: CommandoMessage, expires: Date): Promise<[MessageExpiryModel, boolean | null]> {
    return this.upsert({
      id: msg.id,
      expires,
    });
  }
}
