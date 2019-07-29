const { Router } = require('express');
const dashboardController = require('./controllers/dashboard.controller');
const validator = require('./validators/dashboard.validator');

const router = new Router();

router.post('/dashboard/column/create', validator.validateCreateColumn(), dashboardController.createColumn);
router.post('/dashboard/task/create', dashboardController.createTask);
router.post('/dashboard/company/:company_id/columnOrder/create', dashboardController.createColumnOrder);
router.get('/dashboard/company/:company_id/columns', dashboardController.getCompanyColumns);
router.get('/dashboard/company/subscribe', dashboardController.subscribe);
router.get('/dashboard/company/unsubscribe', dashboardController.unsubscribe);

module.exports = router;