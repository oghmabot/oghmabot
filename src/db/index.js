'use strict';

const { Client } = require('pg');
const { parse } = require('pg-connection-string');

module.exports = {
  getDbClient: () => new Client({
    ...parse(process.env.DATABASE_URL),
    ssl: {
      rejectUnauthorized: false
    }
  })
};
