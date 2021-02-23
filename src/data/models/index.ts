import { Sequelize } from 'sequelize';
import { BuildModel } from './build';
import { DeityModel } from './deity';
import { MessageExpiryModel } from './message';
import { ServerModel } from './server.model';
import { SubscriptionModel } from './subscription.model';

export const initializeAllModels = (sql: Sequelize): void => {
  BuildModel.initialize(sql);
  DeityModel.initialize(sql);
  MessageExpiryModel.initialize(sql);
  ServerModel.initialize(sql);
  SubscriptionModel.initialize(sql);
};

export const purgeRefsToChannel = async (channelId: string): Promise<number> => {
  return await SubscriptionModel.destroy({ where: { channelId } });
};

export const purgeRefsToMessage = async (messageId: string): Promise<number> => {
  return await SubscriptionModel.destroy({ where: { lastMessageId: messageId }});
};

export * from './alignment';
export * from './build';
export * from './deity';
export * from './message';
export * from './server.model';
export * from './status';
export * from './subscription.model';
