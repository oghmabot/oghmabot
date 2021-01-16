import { DataTypes, Model, Sequelize } from 'sequelize';
import { BeamdogAPIResponse } from '../proxy';

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

  static fromBeamdogAPIResponse = (response: BeamdogAPIResponse): Server => (
    {
      id: response.kx_pk,
      name: response.session_name,
      ip: response.host,
      port: response.port,
    }
  );

  static addServer = async (serverInfo: Server): Promise<ServerModel> => await ServerModel.create(serverInfo);

  static getServers = async (): Promise<Server[]> => (await ServerModel.findAll()).map(s => s.get());

  static async getServersFromStringParse(str: string, defaultToAll: boolean = true): Promise<Server[]> {
    const splitString = str.toLowerCase().split(' ');
    const servers = await this.getServers();
    return servers.filter(server => !!splitString.find(inp => server.name.includes(inp) || server.alias?.includes(inp))) || defaultToAll ? servers : [];
  }
}
