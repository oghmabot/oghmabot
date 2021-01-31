import { DataTypes, Model, Sequelize } from 'sequelize';

export enum SubscriptionType {
  Status,
  ArelithAnnouncements,
  ArelithUpdates,
}

export interface Subscription {
  type: SubscriptionType;
  channelId: string;
  subscribedTo?: string;
  autoDeleteMessages?: boolean;
  lastMessageId?: string;
  createdBy?: string;
}

export class SubscriptionModel extends Model<Subscription> {
  static initialize(sequelize: Sequelize): SubscriptionModel {
    return this.init({
      type: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      channelId: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      subscribedTo: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      autoDeleteMessages: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      lastMessageId: DataTypes.STRING,
      createdBy: DataTypes.STRING,
    }, {
      sequelize,
      modelName: 'subscription',
    });
  }

  static async reset(sequelize: Sequelize, force: boolean = true): Promise<void> {
    try {
      SubscriptionModel.initialize(sequelize);
      await SubscriptionModel.sync({ force });
    } catch (error) {
      console.error('[SubscriptionModel] Unexpected error while resetting.', error);
    }
  }

  static addSubscription = async (subscription: Subscription): Promise<SubscriptionModel> => await SubscriptionModel.create(subscription);

  static subscriptionExists = async (subscription: Subscription): Promise<boolean> => !!(await SubscriptionModel.findOne({
    where: {
      type: subscription.type,
      channelId: subscription.channelId,
      subscribedTo: subscription.subscribedTo,
    },
  }));

  static getAllSubscriptions = async (): Promise<Subscription[]> => (await SubscriptionModel.findAll()).map(s => s.get());

  static getSubscriptionsForChannel = async (channelId: string): Promise<Subscription[]> => (await SubscriptionModel.findAll({
    where: {
      channelId,
    },
  })).map(s => s.get());

  static getSubscriptionsForServer = async (serverId: string): Promise<Subscription[]> => (await SubscriptionModel.findAll({
    where: {
      type: SubscriptionType.Status,
      subscribedTo: serverId,
    },
  })).map(s => s.get());
}
