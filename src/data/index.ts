import { Sequelize } from 'sequelize';
import { BuildModel, DeityModel, initializeAllModels, ServerModel, SubscriptionModel } from './models';

export const connect = async (url: string | undefined = process.env.DATABASE_URL): Promise<Sequelize> => {
  if (!url) throw new Error('Database URL is not defined.');

  const sequelize = new Sequelize(url, {
    dialectOptions: { ssl: { rejectUnauthorized: false }},
  });
  initializeAllModels(sequelize);
  return sequelize;
};

export const initialize = async (force: boolean = false, ...dbs: string[]): Promise<void> => {
  const sql = await connect();
  if (!dbs.length) {
    initializeAllModels(sql);
    sql.sync({ force });
  } else {
    if (dbs.includes('builds')) {
      await BuildModel.reset(sql, force);
    }

    if (dbs.includes('deities')) {
      await DeityModel.reset(sql, force);
    }

    if (dbs.includes('servers')) {
      await ServerModel.reset(sql, force);
    }

    if (dbs.includes('subscriptions')) {
      await SubscriptionModel.reset(sql, force);
    }
  }
};
