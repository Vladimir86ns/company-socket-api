const server = require('./server.js');
const { database } = require('./shared/index');
const databaseMysql = require('./shared/database-mysql');
const websocketService = require('../src/shared/websocket/websocket.service');

const init = async () => {
  await database.connect();
  await websocketService.connect();
  await databaseMysql.connect().then(server.start);
};

module.exports = {
  init,
};
