module.exports = {
  port: process.env.PORT || 4000,

  redis: {
    port: 6379,
    url: '127.0.0.1',
  },

  connections: {
    mongodb: {
      host: 'localhost',
      port: 27017,
      user: '',
      password: '',
      database: 'websockets',
    },
  },
};
