const { body } = require('express-validator');

const validateUpdateColumn = () => {
  return [
    body('title', 'Title is required').exists(),
    body('company_id', 'Company Id is required').exists(),
    body('company_id', 'Company Id must be number').isInt(),
    body('column_id', 'Column Id is required').exists(),
  ];
};

module.exports = {
  validateUpdateColumn,
}