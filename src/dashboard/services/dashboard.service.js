const Column = require('../../shared/database/models/column.schema');
const Task = require('../../shared/database/models/task.schema');
const ColumnOrder = require('../../shared/database/models/column-order.schema');
const map = require('lodash/map');

function createColumn(title, company_id, account_id) {
  const column = new Column({ title, company_id, account_id });
  column.save();

  return column;
};

function createTask(title, description, author_id, column_id ) {
  const task = new Task({ title, description, author_id, column_id });
  task.save();

  return task;
};

async function getCompanyColumns(company_id) {
  // TODO find better way to get all company columns with tasks
  const allColumns = await Column.find({company_id}, { __v:0 }).exec();
  const onlyIdsValue = map(allColumns, (column) => {
    return column._id;
  });
  const allTasks = await Task.find({column_id: {$in: onlyIdsValue}}, { __v:0 }).exec();
  const allColumnOrder = await ColumnOrder.findOne({company_id}, { __v:0 }).exec();

  return {
    columns: allColumns,
    tasks: allTasks,
    columnOrder: allColumnOrder
  };
};

async function createColumnOrder(companyId) {
  const columnsIds = await Column.find({company_id: companyId}, { _id: 1 }).exec();
  const onlyIdsValue = map(columnsIds, (column) => {
    return column._id
  });

  console.log(onlyIdsValue);
  const columnOrder = new ColumnOrder({ column_ids:  onlyIdsValue, company_id: companyId});
  columnOrder.save();

  return columnOrder;
}

module.exports = {
  getCompanyColumns,
  createColumn,
  createTask,
  createColumnOrder
}