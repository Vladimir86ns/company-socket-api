const { Router } = require('express');
const dashboardController = require('./controllers/dashboard.controller');

const router = new Router();

router.get('/dashboard/column/create', dashboardController.createColumn);
router.get('/dashboard/task/create', dashboardController.createTask);

router.get('/dashboard/column/get', dashboardController.getColumn);

module.exports = router;