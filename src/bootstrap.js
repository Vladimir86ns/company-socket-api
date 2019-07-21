const server = require('./server.js');
const { database } = require('./shared/index');
const { start } = require('./socket-server.js');
const websocketService = require('../src/shared/websocket/websocket.service');

const init = async () => {
  server.start();
  database.connect();
  start();
  websocketService.connect();
};

module.exports = {
  init,
};
