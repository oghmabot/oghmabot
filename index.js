'use strict';

// main resolves to a module within main.js
// config resolves dynamically depending on the existence of "config.json"
const main = require('./src/main.js');
const config = (function() {
  // This function is run immediately and tries to find the file "config.json"
  try {
    // If config.json doesn't exist, the following line will throw an error
    return require('./config.json');
  } catch(error) {
    // If an error was thrown, we assume there are environment variables stored
    // elsewhere. The thrown error is caught and the following line run instead
    return process.env;
  }
})();

// We call on the imported module "main.js" (see line 1) with config as a parameter
// main.js is assumed to handle everything within the src folder
main(config);
