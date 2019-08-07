const dashboardService = require('../services/dashboard.service');
const { validationResult } = require('express-validator');
const isEmpty = require('lodash/isEmpty');
const get = require('lodash/get');

async function createColumn(req, res) {
  const errors = get(validationResult(req), 'errors');
  if (!isEmpty(errors)) {
    return res.status(404).json(errors);
  }

  const { title, company_id, account_id } = req.body;
  res.json(
    await dashboardService.createColumn(title, company_id, account_id)
  );
};

async function createTask(req, res) {
  const errors = get(validationResult(req), 'errors');
  if (!isEmpty(errors)) {
    return res.status(404).json(errors);
  }

  const { title, description, author_id, column_id, column_order_id, company_id, assigned_ids } = req.body;
  res.json(
    await dashboardService.createTask(title, description, author_id, column_id, column_order_id, company_id, assigned_ids)
  );
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