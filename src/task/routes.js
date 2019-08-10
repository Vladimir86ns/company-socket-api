const { Router } = require('express');
const taskController = require('./controllers/task.controlles');
const validator = require('./validators/task.validator');

const router = new Router();

router.post('/dashboard/task/create', validator.validateCreateTask(), taskController.createTask);

module.exports = router;