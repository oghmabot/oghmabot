'use strict';

const { Client } = require('pg');
const { parse } = require('pg-connection-string');

module.exports = {
  connect: () => new Client({
    ...parse(process.env.DATABASE_URL)
  }).connect()
};
