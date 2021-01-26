import { Model, Sequelize } from 'sequelize/types';

export interface Heresy {
  name: string;
}

export class HeresyModel extends Model<Heresy> {
  static initialize(sequelize: Sequelize): HeresyModel {
    throw new Error('Method not implemented.');
  }
}
