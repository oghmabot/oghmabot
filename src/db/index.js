'use strict';

const Enmap = require('emap');
const Provider = require('./provider');

module.exports = {
  getEnmap: (name) => new Enmap({
    provider: new Provider(name)
  })
};
