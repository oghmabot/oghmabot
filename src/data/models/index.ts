import { Sequelize } from 'sequelize/types';

import { ServerModel } from './server';
import { SubscriptionModel } from './subscription';

export const initializeAllModels = (sql: Sequelize): void => {
  ServerModel.initialize(sql);
  SubscriptionModel.initialize(sql);
};

export * from './server';
export * from './status';
export * from './subscription';
