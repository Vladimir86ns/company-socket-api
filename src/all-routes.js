const dashboardRoute = require('./dashboard/router');
const columnRoutes = require('./column/routes');

const allRoutes = [
  dashboardRoute,
  columnRoutes
];

module.exports = allRoutes