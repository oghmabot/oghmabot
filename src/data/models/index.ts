import { Sequelize } from 'sequelize/types';
import { DeityModel } from './deity';
import { ServerModel } from './server.model';
import { SubscriptionModel } from './subscription.model';

export const initializeAllModels = (sql: Sequelize): void => {
  DeityModel.initialize(sql);
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
export * from './build.model';
export * from './deity';
export * from './server.model';
export * from './status';
export * from './subscription.model';
