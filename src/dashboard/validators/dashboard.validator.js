const { body } = require('express-validator');

const validateCreateColumn = () => {
  return [
    body('title', 'Title is required').exists(),
		body('company_id', 'Company Id is required').exists(),
		body('company_id', 'Company Id must be number').isInt(),
		body('account_id', 'Account Id must be number').isInt(),
		body('account_id', 'Account Id is required').exists(),
  ];
};

module.exports = {
	validateCreateColumn
}