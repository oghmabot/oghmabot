'use strict';

const Enmap = require('enmap');

module.exports = {
  getEnmap: (name, options) => new Enmap({ name, ...options }),
};
