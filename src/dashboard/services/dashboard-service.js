const Column = require('../../shared/database/models/column.schema');
const ColumnOrder = require('../../shared/database/models/column-order.schema');
const columnService = require('../../column/services/column.service');
const map = require('lodash/map');
const isEmpty = require('lodash/isEmpty');
const webSocketService = require('../../shared/websocket/websocket.service');
const dbMysql = require('../../shared/database-mysql');

/**
 * Get all company for dashboards, if company, do not have dashboard,
 * create new column order for that company.
 * 
 * @param {number} company_id 
 */
async function getCompanyDashboard(company_id) {
  const queryColumns = `
    SELECT * FROM columns WHERE company_id = ${company_id}
  `;
  let mysqlColumns = await dbMysql.query(queryColumns)
  .then(res => res)
  .catch(err => console.log(err))

  const onlyIdsMysqlIds = 
    !isEmpty(mysqlColumns) ? 
      map(mysqlColumns, (column) => {
        return column.id;
      }) :
      [];

  const queryTasks = `
    SELECT * FROM tasks WHERE column_id IN  (${onlyIdsMysqlIds})
  `;
  const mysqlTasks = !isEmpty(mysqlColumns) ? 
  await dbMysql.query(queryTasks)
    .then(res => res)
    .catch(err => console.log(err)) :
  mysqlColumns;

  const queryDashboard = `
    SELECT * FROM dashboards WHERE company_id = ${company_id}
  `;
  let mysqlDashboard = await dbMysql.query(queryDashboard)
  .then(res => res)
  .catch(err => console.log(err))

  // if new company does not have column order, create new one
  if (isEmpty(mysqlDashboard)) {
    mysqlDashboard = await createColumnOrder(company_id, queryDashboard);
  }

  return {
    columns: mysqlColumns,
    tasks: mysqlTasks,
    dashboard: mysqlDashboard[0]
  };
};

/**
 * Create column order, on new task dashboard.
 * 
 * @param {number} companyId 
 */
async function createColumnOrder(companyId, queryDashboard) {
  const query = `
    INSERT INTO dashboards (company_id, created_at)
    VALUES (
      (
        SELECT id
        FROM companies
        WHERE id = ${companyId}
      ),
      CURRENT_TIMESTAMP
    )
  `;

  await dbMysql.query(query)
    .then(res => console.log(res))
    .catch(err => console.log(err))

  return await dbMysql.query(queryDashboard)
    .then(res => res)
    .catch(err => console.log(err))
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
        await columnService.updateColumnTaskIds(column.column_id, column.task_ids);
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
  getCompanyDashboard,
  createColumnOrder,
  subscribe,
  unsubscribe,
  updateColumnOrder
}