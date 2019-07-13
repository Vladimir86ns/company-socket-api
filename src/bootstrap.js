const server = require('./server.js');
const { database } = require('./shared/index');

const init = async () => {
  server.start();
  database.connect();
};

module.exports = {
  init,
};
