const { body } = require('express-validator');

const validateCreateTask = () => {
  return [
    body('title', 'Title of task is required').exists(),
    body('title', 'Title is max to have 100 characters!').isLength({max: 100}),
    body('description', 'Description is required').exists().isLength({max: 2000}),
    body('company_id', 'Company Id must be number').isInt(),
    body('company_id', 'Company Id is required').exists(),
    body('author_id', 'Author Id must be number').isInt(),
    body('author_id', 'Author Id is required').exists(),
    body('author_name', 'Author name is required').exists(),
    body('column_id', 'Column Id is required').exists(),
    body('column_order_id', 'Column order id is required').exists(),
  ];
};

const validateUpdateTask = () => {
  return [
    body('title', 'Title of task is required').exists(),
    body('title', 'Title is max to have 100 characters!').isLength({max: 100}),
    body('description', 'Description is required').exists().isLength({max: 2000}),
    body('task_id', 'Task Id is required').exists(),
    body('company_id', 'Company Id must be number').isInt(),
    body('company_id', 'Company Id is required').exists(),
    body('account_id', 'Account Id must be number').isInt(),
    body('account_id', 'Account Id is required').exists(),
    body('column_id', 'Column Id is required').exists(),
    body('column_order_id', 'Column order id is required').exists(),
    body('only_assigned_can_see', 'Can asigned people see is required').exists(),
  ];
};

module.exports = {
  validateCreateTask,
  validateUpdateTask,
}