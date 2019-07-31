const Column = require('../../shared/database/models/column.schema');
const Task = require('../../shared/database/models/task.schema');
const ColumnOrder = require('../../shared/database/models/column-order.schema');
const map = require('lodash/map');
const isEmpty = require('lodash/isEmpty');
const webSocketService = require('../../shared/websocket/websocket.service');

/**
 * Create new column, and update column order with column id.
 * 
 * @param {string} title 
 * @param {number} company_id 
 * @param {number} account_id 
 */
async function createColumn(title, company_id, account_id) {
  const column = new Column({ title, company_id, account_id });
  await column.save();

  const columnOrder = await updateColumnOrder(company_id);
  const results = await getCompanyColumns(company_id);
  webSocketService.getConnection().emit(`${columnOrder._id}-${account_id}-${company_id}`, results);

  return results;
};

/**
 * Create new task, and update column with new task id, and put id 
 * on first element of array.
 * 
 * @param {string} title 
 * @param {string} description 
 * @param {number} authorId 
 * @param {number} columnId 
 * @param {string} columnOrderId 
 * @param {number} companyId 
 */
async function createTask(title, description, authorId, columnId, columnOrderId, companyId ) {
  const task = new Task({ title, description, author_id: authorId, column_id: columnId });
  await task.save();
  const column = await Column.findOne({_id: columnId}).exec();
  await column.update({task_ids: [task._id].concat(column.task_ids)});
  const results = await getCompanyColumns(companyId);
  webSocketService.getConnection().emit(`${columnOrderId}-${column.account_id}-${companyId}`, results);

  return results;
};

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
  createColumn,
  createTask,
  createColumnOrder,
  subscribe,
  unsubscribe
}