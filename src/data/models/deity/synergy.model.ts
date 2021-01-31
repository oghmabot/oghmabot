import { DataTypes, Model, Sequelize } from 'sequelize';

export interface Synergy {
  heresyId: number;
  deityId: number;
}

export class SynergyModel extends Model<Synergy> {
  static initialize(sequelize: Sequelize): SynergyModel {
    return this.init({
      heresyId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
          model: 'deities',
          key: 'id',
        },
      },
      deityId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
          model: 'deities',
          key: 'id',
        },
      },
    }, {
      sequelize,
      modelName: 'synergies',
    });
  }
}
