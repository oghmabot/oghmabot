'use strict';

const { getEnmap } = require('../../../db');
const servers = getEnmap('servers');
const {
  ArelithIP,
  BeamdogAPI,
} = require('./data.json');
const fetch = require('node-fetch');

const updateServerStatus = (client) => {

};

const fetchServerStatus = (server) => {
  return fetch(`${BeamdogAPI}${ArelithIP}/${server.port}`)
    .then(response => response.json());
};

module.exports = {
  fetchServerStatus,
  updateServerStatus,
};
