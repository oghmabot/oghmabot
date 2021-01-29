import { Sequelize } from 'sequelize';
import { DeityModel, initializeAllModels, ServerModel, SubscriptionModel } from './models';
import { ArelithWikiScraper, fetchAllDeities } from './proxies';

export const connect = async (url: string | undefined = process.env.DATABASE_URL): Promise<Sequelize> => {
  if (!url) throw new Error('Database URL is not defined.');

  console.log(await ArelithWikiScraper.fetchAllCharacterBuilds());

  const sequelize = new Sequelize(url, {
    dialectOptions: { ssl: { rejectUnauthorized: false }},
    logging: false,
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
    if (dbs.includes('deities')) {
      DeityModel.initialize(sql);
      DeityModel.sync({ force });

      const deities = await fetchAllDeities();
      deities.forEach(DeityModel.addDeity);
    }

    if (dbs.includes('servers')) {
      ServerModel.initialize(sql);
      ServerModel.sync({ force });
    }

    if (dbs.includes('subscriptions')) {
      SubscriptionModel.initialize(sql);
      SubscriptionModel.sync({ force });
    }
  }
};
