'use strict';

const { ArelithServers } = require('./config.json');
const { fetchServerStatus } = require('./status');

describe('Arelith Status', () => {
  describe('fetchServerStatus', () => {
    it('should return a valid server status', () => {
      const server = ArelithServers[0];
      return fetchServerStatus(server)
        .then(data => {
          expect(data).toBeDefined();
          expect(data.name).toBe('Arelith - Cordor and Planes');
        });
    });
  });
});