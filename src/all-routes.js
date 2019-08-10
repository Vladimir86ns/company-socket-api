const dashboardRoute = require('./dashboard/router');
const columnRoutes = require('./column/routes');
const taskRoutes = require('./task/routes');

const allRoutes = [
  dashboardRoute,
  columnRoutes,
  taskRoutes
];

module.exports = allRoutes