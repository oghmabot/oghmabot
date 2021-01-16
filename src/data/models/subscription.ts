import { DataTypes, Model, Sequelize } from "sequelize";

export interface Subscription {
  channel: string;
  server: string;
}

export class SubscriptionModel extends Model<Subscription> {
  static initialize(sequelize: Sequelize): SubscriptionModel {
    return this.init({
      channel: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      server: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    }, {
      sequelize,
      modelName: 'subscription'
    });
  }

  static async getSubscriptions(): Promise<Subscription[]> {
    const servers = await this.findAll();
    return servers.map(s => s.get());
  }
}
