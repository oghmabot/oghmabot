import { Sequelize } from 'sequelize';
import { Server, ServerProxy } from './models';

export const connect = async (url: string): Promise<Sequelize> => {
  const sql = new Sequelize(url, {
    dialectOptions: { ssl: { rejectUnauthorized: false }},
  });
  ServerProxy.initialize(sql);

  return sql;
};

export {
  Server,
  ServerProxy,
};
