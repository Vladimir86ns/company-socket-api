const taskDBService = require('../../task/services/task-db.service');
const columnDBService = require('./column-db.service');
const dashboardDBService = require('../../dashboard/services/dashboard-db.service');
const ColumnOrder = require('../../shared/database/models/column-order.schema');
const map = require('lodash/map');
const isEmpty = require('lodash/isEmpty');
const webSocketService = require('../../shared/websocket/websocket.service');
const { UPDATE_COLUMN} = require('../../shared/consts/messages-types');

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
  results.message_type = UPDATE_COLUMN;
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
  updateColumn
};
