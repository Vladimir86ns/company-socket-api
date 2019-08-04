const ColumnOrder = require('../../shared/database/models/column-order.schema');

async function findOneDashboard(query, params) {
  return await ColumnOrder.findOne(query, params).exec();
};

module.exports = {
  findOneDashboard
};

