const mysql = require('mysql');
let pool = null;

// const connect = () => {
//   pool = mysql.createPool({
//     host: '127.0.0.1',
//     user: 'root',
//     password: '',
//     database: 'com'
//   });

//   console.log('MYSQL connected!');
// };

// const getPool = () => {
//   return pool;
// };

// module.exports = {
//   connect,
//   getPool,
// };


let connection = null;
let isConnected = false;

const connect = () => {
  return new Promise((resolve, reject) => {
    connection = mysql.createConnection({
      host     : '127.0.0.1', //  eslint-disable-line
      user     : 'root', //  eslint-disable-line
      password : '',  //  eslint-disable-line
      database : 'com' //  eslint-disable-line
    });

    connection.connect((err) => {
      if (err) {
        console.error('error: ' + err.message);

        return reject();  //  eslint-disable-line
      }

      isConnected = true;
      console.log('Connected to the MySQL.');
      resolve();
    });
  });
};

const query = (mysqlQuery) => {
  return new Promise((resolve, reject) => {
    if (!isConnected) {
      return reject( new Error('Not connected to DB.'));
    }

    connection.query(mysqlQuery, (error, results, fields) => {
      if (error) {
        return reject(error);
      }
      resolve(results);
    });
  });
};

module.exports = {
  connect,
  query,
};