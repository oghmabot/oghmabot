import { DataTypes, FindOptions, Model, Sequelize } from 'sequelize';
import { BeamdogApiResponseBody } from '../proxy';

export interface Server {
  id: string;
  name: string;
  ip: string;
  port: number;
  alias?: string[];
  href?: string;
  img?: string;
}

export class ServerModel extends Model<Server> {
  static initialize(sequelize: Sequelize): ServerModel {
    return this.init({
      id: {
        type: DataTypes.STRING,
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

  static fromBeamdogApiResponseBody = (response: BeamdogApiResponseBody): Server => (
    {
      id: response.kx_pk,
      name: response.session_name,
      ip: response.host,
      port: response.port,
    }
  );

  static addServer = async (serverInfo: Server): Promise<ServerModel> => await ServerModel.create(serverInfo);

  static removeServer = async (server: Server): Promise<number> => await ServerModel.destroy({
    where: {
      id: server.id,
    },
  });

  static serverExists = async (server: Server): Promise<boolean> => (await ServerModel.getServerById(server.id)) !== undefined;

  static getServerById = async (serverId: string): Promise<Server | undefined> => (await ServerModel.findByPk(serverId))?.get();

  static getServers = async (options?: FindOptions): Promise<Server[]> => (await ServerModel.findAll({
    order: ['name'],
    ...options,
  })).map(s => s.get());

  static async getServersFromStringParse(str: string): Promise<Server[]> {
    const allServers = await this.getServers();
    const splitString = str.toLowerCase().split(' ');
    return allServers.filter(server => {
      for (const inp of splitString) {
        if (server.alias?.includes(inp) || (inp.length >= 3 && server.name.toLowerCase().includes(inp))) return true;
      }
    });
  }
}
