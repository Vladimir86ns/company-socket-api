const Column = require('../../shared/database/models/column.schema');
const Task = require('../../shared/database/models/task.schema');
const ColumnOrder = require('../../shared/database/models/column-order.schema');
const map = require('lodash/map');
const isEmpty = require('lodash/isEmpty');
const webSocketService = require('../../shared/websocket/websocket.service');

/**
 * Get all company for dashboards, if company, do not have dashboard,
 * create new column order for that company.
 * 
 * @param {number} company_id 
 */
async function getCompanyColumns(company_id) {
  // TODO find better way to get all company columns with tasks
  const allColumns = await Column.find({company_id}, { __v:0 }).exec();
  const onlyIdsValue = map(allColumns, (column) => {
    return column._id;
  });
  const allTasks = await Task.find({column_id: {$in: onlyIdsValue}}, { __v:0 }).exec();
  let columnOrder = await ColumnOrder.findOne({company_id}, { __v:0 }).exec();

  // if new company does not have column order, create new one
  if (isEmpty(columnOrder)) {
    columnOrder = await createColumnOrder(company_id);
  }

  return {
    columns: allColumns,
    tasks: allTasks,
    columnOrder: columnOrder
  };
};

/**
 * Create column order, on new task dashboard.
 * 
 * @param {number} companyId 
 */
async function createColumnOrder(companyId) {
  const columnOrder = new ColumnOrder({ column_ids:  [], company_id: companyId});
  columnOrder.save();

  return columnOrder;
}

/**
 * Update column order with column ids.
 * 
 * @param {number} companyId 
 */
async function updateColumnOrder(companyId) {
  const columnsIds = await Column.find({company_id: companyId}, { _id: 1 }).exec();
  const onlyIdsValue = map(columnsIds, (column) => {
    return column._id
  });

  await ColumnOrder.findOneAndUpdate({company_id: companyId}, {column_ids: onlyIdsValue});

  return await ColumnOrder.findOne({company_id: companyId});
}

/**
 * Subscribe to event from web.
 * 
 * @param {string} eventName 
 */
function subscribe(eventName) {
  webSocketService.getConnection().subscribe(eventName, (e) => {
    if (e.updated.columns.length) {
      e.updated.columns.forEach(async column => {
        await Column.findOneAndUpdate({_id: column.column_id}, {task_ids: column.task_ids});
      });
    }
    webSocketService.getConnection().emit(`${e.updated.column_order_id}-${e.updated.account_id}-${e.updated.company_id}`, e.newState);
  })
}

/**
 * Unsubscribe to event from web.
 * 
 * @param {string} eventName 
 */
function unsubscribe(eventName) {
  webSocketService.getConnection().unsubscribe(eventName);
}

module.exports = {
  getCompanyColumns,
  createColumnOrder,
  subscribe,
  unsubscribe,
  updateColumnOrder
}