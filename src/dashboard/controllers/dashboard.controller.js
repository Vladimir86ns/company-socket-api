const dashboardService = require('../services/dashboard.service');

function createColumn(req, res) {
  const { title, company_id, account_id } = req.body;
  const results = dashboardService.createColumn(title, company_id, account_id);
  res.json(results);
};

function createTask(req, res) {
  const { title, description, author_id, column_id } = req.body;
  const results = dashboardService.createTask(title, description, author_id, column_id);
  res.json(results);
};

async function getCompanyColumns(req, res) {
  const { company_id } = req.params;
  const results = await dashboardService.getCompanyColumns(company_id);
  res.json(results);
};

async function createColumnOrder(req, res) {
  const { company_id } = req.params;
  const result = await dashboardService.createColumnOrder(company_id);
  res.json(result);
}

function subscribe(req, res) {
  dashboardService.subscribe(req.query.event_name);
  res.json(`You are subscribed on "${req.query.event_name}" event name`);
}

function unsubscribe(req, res) {
  dashboardService.unsubscribe(req.query.event_name);
  res.json(`You are un subscribed on "${req.query.event_name}" event name`);
}

module.exports = {
  getCompanyColumns,
  createColumn,
  createTask,
  createColumnOrder,
  subscribe,
  unsubscribe
}