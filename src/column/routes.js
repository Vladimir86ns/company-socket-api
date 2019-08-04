const { Router } = require('express');
const columnController = require('./controllers/column.controller');
const validator = require('./validators/column.validator');

const router = new Router();

router.post('/dashboard/column/update', validator.validateUpdateColumn(), columnController.updateColumn);

module.exports = router;