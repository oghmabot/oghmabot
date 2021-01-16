import { Sequelize } from 'sequelize';
import { initializeAllModels } from './models';

export const connect = async (url: string | undefined = process.env.DATABASE_URL): Promise<Sequelize> => {
  if (!url) throw new Error('Database URL is not defined.');

  const sql = new Sequelize(url, {
    dialectOptions: { ssl: { rejectUnauthorized: false }},
  });
  initializeAllModels(sql);
  return sql;
};

export const initialize = async (force: boolean = false): Promise<void> => {
  const sql = await connect();
  initializeAllModels(sql);
  sql.sync({ force });
};

export * from './models';
