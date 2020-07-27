'use strict';

const { Client } = require('pg');

module.exports = {
  connect: () => new Client({
    connectionString: `${process.env.DATABASE_URL}?ssl=true`
  }).connect()
};
