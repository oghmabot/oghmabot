'use strict';

const { Server } = require('./models/Server');

module.exports = {
  initialize: async sequelize => {
    Server.init(sequelize);
    await sequelize.sync();

    const { ArelithIP, ArelithPortal, ArelithServers } = require('../assets/arelith/status/config.json');

    const servers = ArelithServers.map(s => Server.addServer({
      id: ArelithIP.replace(/[.]/g, '') + s.port,
      name: s.name,
      alias: s.abbreviations,
      ip: ArelithIP,
      port: s.port,
      href: ArelithPortal,
      img: s.img,
    }));

    Promise.all(servers).then(async () => await sequelize.sync());
  },
  Server,
};
