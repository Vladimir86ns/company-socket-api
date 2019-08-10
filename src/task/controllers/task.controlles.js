const taskService = require('../services/task.service');
const { validationResult } = require('express-validator');
const isEmpty = require('lodash/isEmpty');
const get = require('lodash/get');

async function createTask(req, res) {
  const errors = get(validationResult(req), 'errors');
  if (!isEmpty(errors)) {
    return res.status(404).json(errors);
  }

  res.json(
    await taskService.createTask(req.body)
  );
};

module.exports = {
  createTask,
}