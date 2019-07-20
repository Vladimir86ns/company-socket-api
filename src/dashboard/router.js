const { Router } = require('express');
const dashboardController = require('./controllers/dashboard.controller');
var cors = require('cors')

const router = new Router();

router.post('/dashboard/column/create', dashboardController.createColumn);
router.post('/dashboard/task/create', dashboardController.createTask);
router.post('/dashboard/company/:company_id/columnOrder/create', dashboardController.createColumnOrder);
router.get('/dashboard/company/:company_id/columns', dashboardController.getCompanyColumns);

module.exports = router;