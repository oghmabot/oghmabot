'use strict';

const config = require('./config.json');
const { main } = require('./src');
const dotenv = require('dotenv');

dotenv.config();
main(config);
