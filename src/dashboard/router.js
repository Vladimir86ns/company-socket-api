const { Router } = require('express');
const dashboardController = require('./controllers/dashboard.controller');

const router = new Router();

router.post('/dashboard/column/create', dashboardController.createColumn);
router.post('/dashboard/task/create', dashboardController.createTask);
router.get('/dashboard/company/:company_id/columns', dashboardController.getCompanyColumns);

module.exports = router;