'use strict';

const Enmap = require('enmap');
const Provider = require('./provider');

module.exports = {
  getEnmap: (name) => new Enmap({
    provider: new Provider(name),
  }),
};
