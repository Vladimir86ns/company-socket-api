const mongoose = require('mongoose');
const configuration = require('../../../config/env/local');
const { host, port, database, user, password } = configuration.connections.mongodb;

/**
 * Compose mongo db url string
 */
const getConnectionString = () => {
  return `mongodb://${host}:${port}/${database}`;
};

const connect = async () => {
  let db = mongoose.connection;

  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', () => {
    console.log(`Connected to database ${database}`);
  });

  await mongoose.connect(getConnectionString(), {
    user: user,
    pass: password,
    useNewUrlParser: true,
  });
};

module.exports = {
  connect,
};
