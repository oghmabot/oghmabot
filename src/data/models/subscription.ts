import { DataTypes, FindOptions, Model, Sequelize } from "sequelize";

export interface Subscription {
  channel: string;
  server: string;
  createdBy?: string;
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
      createdBy: {
        type: DataTypes.STRING,
      },
    }, {
      sequelize,
      modelName: 'subscription',
    });
  }

  static addSubscription = async (subscription: Subscription): Promise<SubscriptionModel> => await SubscriptionModel.create(subscription);

  static subscriptionExists = async (subscription: Subscription): Promise<boolean> => !!(await SubscriptionModel.findOne({
    where: {
      channel: subscription.channel,
      server: subscription.server,
    },
  }));

  static getAllSubscriptions = async (): Promise<Subscription[]> => (await SubscriptionModel.findAll()).map(s => s.get());

  static getSubscriptionsForChannel = async (channelId: string): Promise<Subscription[]> => (await SubscriptionModel.findAll({
    where: {
      channel: channelId,
    },
  })).map(s => s.get());

  static getSubscriptionsForServer = async (serverId: string): Promise<Subscription[]> => (await SubscriptionModel.findAll({
    where: {
      server: serverId,
    },
  })).map(s => s.get());
}
