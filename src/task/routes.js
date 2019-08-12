const { Router } = require('express');
const taskController = require('./controllers/task.controlles');
const validator = require('./validators/task.validator');

const router = new Router();

router.post('/dashboard/task/create', validator.validateCreateTask(), taskController.createTask);
router.post('/dashboard/task/update', validator.validateUpdateTask(), taskController.updateTask);

module.exports = router;