const dashboardService = require('../services/dashboard.service');

async function getCompanyDashboard(req, res) {
  const { company_id } = req.params;
  const results = await dashboardService.getCompanyDashboard(company_id);
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
  getCompanyDashboard,
  createColumnOrder,
  subscribe,
  unsubscribe
}