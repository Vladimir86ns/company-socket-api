const dashboardService = require('../services/dashboard.service');

async function createColumn(req, res) {
  const results = dashboardService.createColumn();
  res.json(results);
};

async function createTask(req, res) {
  const results = dashboardService.createTask();
  res.json(results);
};

async function getColumn(req, res) {
  const results = dashboardService.getColumn();
  res.json(results);
};

module.exports = {
  getColumn,
  createColumn,
  createTask,
}