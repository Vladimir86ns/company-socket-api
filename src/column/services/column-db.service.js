const Column = require('../../shared/database/models/column.schema');

async function getSingleColumn(query, params = {}) {
  return await Column.findOne(query, params).exec();
}

async function updateSingleColumn(query, params = {}) {
  return await Column.updateOne(query, params);
}

async function findColumn(query, params = {}) {
  return await Column.find(query, params).exec();
}

module.exports = {
  getSingleColumn,
  updateSingleColumn,
  findColumn
};