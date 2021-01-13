const { DataTypes, Model } = require('sequelize');

class Server extends Model {
  static init(sequelize) {
    super.init({
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

  static async addServer(serverInfo) {
    return await Server.create(serverInfo);
  }
}

module.exports = {
  Server,
};
