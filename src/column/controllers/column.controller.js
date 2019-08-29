const columnService = require('../services/column.service');
const { validationResult } = require('express-validator');
const isEmpty = require('lodash/isEmpty');
const get = require('lodash/get');

async function createColumn(req, res) {
  const errors = get(validationResult(req), 'errors');
  if (!isEmpty(errors)) {
    return res.status(404).json(errors);
  }

  res.json(
    await columnService.createColumn(req.body)
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
