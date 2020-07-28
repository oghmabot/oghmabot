const {
  ArelithPortal,
  ArelithServers,
} = require('./status/config.json');

module.exports = {
  ArelithPortal,
  ArelithServers,
  status: require('./status'),
  updates: require('./updates'),
};