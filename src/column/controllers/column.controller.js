const columnService = require('../services/column.service');
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
    await columnService.createColumn(title, company_id, account_id)
  );
};

async function updateColumn(req, res) {
  const errors = get(validationResult(req), 'errors');
  if (!isEmpty(errors)) {
    return res.status(404).json(errors);
  }

  const { title, column_id, company_id } = req.body;
  res.json(
    await columnService.updateColumn(title, column_id, company_id)
  );
};

module.exports = {
  updateColumn,
  createColumn,
};
