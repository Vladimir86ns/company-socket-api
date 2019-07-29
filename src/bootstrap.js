const server = require('./server.js');
const { database } = require('./shared/index');
const websocketService = require('../src/shared/websocket/websocket.service');

const init = async () => {
  server.start();
  database.connect();
  websocketService.connect();
};

module.exports = {
  init,
};
