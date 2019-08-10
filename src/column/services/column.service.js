const Column = require('../../shared/database/models/column.schema');
const taskDBService = require('../../task/services/task-db.service');
const columnDBService = require('./column-db.service');
const dashboardService = require('../../dashboard/services/dashboard.service');
const dashboardDBService = require('../../dashboard/services/dashboard-db.service');
const ColumnOrder = require('../../shared/database/models/column-order.schema');
const map = require('lodash/map');
const isEmpty = require('lodash/isEmpty');
const webSocketService = require('../../shared/websocket/websocket.service');
const { TYPE_CREATE_COLUMN, TYPE_UPDATE_COLUMN } = require('../../shared/consts/messages-types');

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

  const columnOrder = await dashboardService.updateColumnOrder(company_id);
  const results = await getCompanyColumns(company_id);

  results.updateData = {
    message_type: TYPE_CREATE_COLUMN,
    new_name: title
  };

  webSocketService.getConnection().emit(`${columnOrder._id}-${account_id}-${company_id}`, results);

  return results;
};

/**
 * Update column title, and emit changes results.
 * 
 * @param {string} title 
 * @param {string} columnId 
 * @param {number} companyId 
 */
async function updateColumn(title, columnId, companyId) {
  await columnDBService.updateSingleColumn(
    {_id: columnId, company_id: companyId},
    {title: title}
  );

  const column = await columnDBService.getSingleColumn({_id: columnId});
  const results = await getCompanyColumns(companyId);

  results.updateData = {
    message_type: TYPE_UPDATE_COLUMN,
    new_name: title
  };

  webSocketService.getConnection().emit(`${results.columnOrder._id}-${column.account_id}-${companyId}`, results);

  return results;
};

/**
 * Get all company for dashboards, if company, do not have dashboard,
 * create new column order for that company.
 * 
 * @param {number} companyId 
 */
async function getCompanyColumns(companyId) {
  // TODO find better way to get all company columns with tasks
  const allColumns = await columnDBService.findColumn({company_id: companyId}, { __v: 0  });
  const onlyIdsValue = map(allColumns, (column) => {
    return column._id;
  });

  const allTasks = await taskDBService.findTasks({column_id: {$in: onlyIdsValue}}, { __v: 0 });
  let columnOrder = await dashboardDBService.findOneDashboard({company_id: companyId}, { __v: 0 });

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
};

module.exports = {
  updateColumn,
  getCompanyColumns,
  createColumn,
};
