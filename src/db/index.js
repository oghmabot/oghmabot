'use strict';

const Enmap = require('enmap');
const Provider = require('./provider');

module.exports = {
  getEnmap: async (name) => {
    const enmap = new Enmap({
      provider: new Provider(name),
    });
    await enmap.defer;
    return enmap;
  },
};
