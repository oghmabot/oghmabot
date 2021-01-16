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

  static addSubscription = async (subscription: Subscription): Promise<SubscriptionModel> => await SubscriptionModel.create(subscription);

  static getSubscriptions = async (): Promise<Subscription[]> => (await SubscriptionModel.findAll()).map(s => s.get());
}
