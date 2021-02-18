import { CommandoMessage } from 'discord.js-commando';
import { DataTypes, FindOptions, Model, Sequelize } from 'sequelize';

export interface MessageExpiry {
  messageId: string;
  channelId: string;
  guildId?: string;
  expires: Date;
}

export class MessageExpiryModel extends Model<MessageExpiry> {
  static initialize(sequelize: Sequelize): MessageExpiryModel {
    return this.init({
      messageId: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      channelId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      guildId: {
        type: DataTypes.STRING,
        allowNull: true,
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

  static async reset(sequelize: Sequelize, force: boolean = true): Promise<void> {
    try {
      this.initialize(sequelize);
      await this.sync({ force });
    } catch (error) {
      console.error('[MessageExpiryModel] Unexpected error while resetting.', error);
      throw error;
    }
  }

  static async get(id: string): Promise<MessageExpiry | undefined> {
    return (await this.findByPk(id))?.get();
  }

  static async getAll(options?: FindOptions): Promise<MessageExpiry[]> {
    return (await this.findAll(options)).map(e => e.get());
  }

  static async setExpiry(msg: CommandoMessage, expires: Date): Promise<[MessageExpiryModel, boolean | null]> {
    const { channel, guild } = msg;
    return this.upsert({
      messageId: msg.id,
      channelId: channel.id,
      guildId: guild.id,
      expires,
    });
  }
}
