import { DataTypes, Model, Sequelize } from 'sequelize';

export interface Server {
  id: number;
  name: string;
  ip: string;
  port: number;
  alias?: string[];
  href?: string;
  img?: string;
}

export class ServerProxy extends Model<Server> {
  static initialize(sequelize: Sequelize): ServerProxy {
    return this.init({
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      ip: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      port: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      alias: DataTypes.ARRAY(DataTypes.STRING),
      href: DataTypes.STRING,
      img: DataTypes.STRING,
    }, {
      sequelize,
      modelName: 'server',
    });
  }

  static async addServer(serverInfo: Server): Promise<ServerProxy> {
    return await ServerProxy.create(serverInfo);
  }

  static async getServers(): Promise<Server[]> {
    const servers = await ServerProxy.findAll();
    return servers.map(s => s.get());
  }
}
