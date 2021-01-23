import { Sequelize } from 'sequelize/types';
import { DeityModel } from './deity';
import { ServerModel } from './server';
import { SubscriptionModel } from './subscription';

export const initializeAllModels = (sql: Sequelize): void => {
  DeityModel.initialize(sql);
  ServerModel.initialize(sql);
  SubscriptionModel.initialize(sql);
};

export * from './deity';
export * from './server';
export * from './status';
export * from './subscription';
