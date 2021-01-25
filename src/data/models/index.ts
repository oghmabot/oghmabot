import { Sequelize } from 'sequelize/types';
import { DeityModel } from './deity.model';
import { ServerModel } from './server.model';
import { SubscriptionModel } from './subscription.model';

export const initializeAllModels = (sql: Sequelize): void => {
  DeityModel.initialize(sql);
  ServerModel.initialize(sql);
  SubscriptionModel.initialize(sql);
};

export * from './alignment';
export * from './deity.model';
export * from './server.model';
export * from './status';
export * from './subscription.model';
