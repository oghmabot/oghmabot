import { DataTypes, FindOptions, Model, Sequelize } from 'sequelize';
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

  static serverExists = async (server: Server): Promise<boolean> => (await ServerModel.getServerById(server.id)) !== undefined;

  static getServerById = async (serverId: string): Promise<Server | undefined> => (await ServerModel.findByPk(serverId))?.get();

  static getServers = async (whereClause: FindOptions): Promise<Server[]> => (await ServerModel.findAll(whereClause)).map(s => s.get());

  static getAllServers = async (): Promise<Server[]> => (await ServerModel.findAll()).map(s => s.get());

  static async getServersFromStringParse(str: string): Promise<Server[]> {
    const allServers = await this.getAllServers();
    const splitString = str.toLowerCase().split(' ');
    return allServers.filter(server => {
      for (const inp of splitString) {
        if (server.alias?.includes(inp) || (inp.length >= 3 && server.name.toLowerCase().includes(inp))) return true;
      }
    });
  }
}
