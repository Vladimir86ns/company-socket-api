const express = require('express')
const app = express()
const configuration = require('../config/env/local.js');
const allRoutes = require('./all-routes');

/**
 * Start express server to listen on port provided in config
 */
const start = () => {
    app.use(allRoutes);
    const { port } = configuration;
    app.get('/', (req, res) => res.send('Hello World!'))

    app.listen(port, () => console.log(`Example app listening on port ${port}!`))
};
  
module.exports = {
    start: start,
};