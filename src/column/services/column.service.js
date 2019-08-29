const dashboardService = require('../../dashboard/services/dashboard-service');
const webSocketService = require('../../shared/websocket/websocket.service');
const dbMysql = require('../../shared/database-mysql');
const { TYPE_CREATE_COLUMN, TYPE_UPDATE_COLUMN } = require('../../shared/consts/messages-types');

/**
 * Create new column, and update column order with column id.
 * 
 * @param {string} title 
 * @param {number} company_id 
 * @param {number} account_id 
 */
async function createColumn(attributes) {
  const query = `
    INSERT INTO columns (title, company_id, account_id, dashboard_id, created_at)
    VALUES (
      '${attributes.title}',
      ${attributes.company_id},
      ${attributes.account_id},
      (SELECT id FROM dashboards WHERE id = ${attributes.dashboard_id}),
      CURRENT_TIMESTAMP
    )`;

  dbMysql.query(query)
    .then(res => getAndUpdateDashboardWithColumnIds(res.insertId, attributes.company_id))
    .catch(err => console.log(err));

  const newResults = await dashboardService.getCompanyDashboard(attributes.company_id);

  newResults.updateData = {
    message_type: TYPE_CREATE_COLUMN,
    new_name: attributes.title
  };

  webSocketService.getConnection().emit(`${attributes.dashboard_id}-${attributes.account_id}-${attributes.company_id}`, newResults);

  return newResults;
};

/**
 * Update column task ids.
 * 
 * @param {string} title 
 * @param {number} company_id 
 * @param {number} account_id 
 */
async function updateColumnTaskIds(columnId, taskIds) {
  const query = `UPDATE columns SET task_ids = '${taskIds.toString()}' WHERE id = ${columnId}`;

  await dbMysql.query(query)
    .then(res => console.log('columns is updated', res))
    .catch(err => console.log(err));
};

/**
 * Update column title, and emit changes results.
 * 
 * @param {string} title 
 * @param {string} columnId 
 * @param {number} companyId 
 */
async function updateColumn(title, columnId, companyId) {
  const query = `
    UPDATE columns 
    SET 
    title = '${title}' 
    WHERE id = ${columnId}`;

  await dbMysql.query(query)
    .then(res => console.log('columns is updated', res))
    .catch(err => console.log(err));

  const newResults = await dashboardService.getCompanyDashboard(companyId);

  newResults.updateData = {
    message_type: TYPE_UPDATE_COLUMN,
    new_name: title
  };

  webSocketService.getConnection().emit(`${newResults.dashboard.id}-${newResults.columns[0].account_id}-${companyId}`, newResults);

  return newResults;
};

async function getAndUpdateDashboardWithColumnIds(newId, companyId) {
  const query = `
    SELECT column_ids 
    FROM dashboards
    WHERE company_id = ${companyId}`
  dbMysql.query(query)
    .then(res => {
      updateDashboardWithColumnIds(res[0].column_ids, newId, companyId);
    })
    .catch(err => console.log(err));
}

async function updateDashboardWithColumnIds(ids, newId, companyId) {
  const oldIds = ids ? ids.split(",") : [];
  oldIds.push(newId);
  const query = `UPDATE dashboards SET column_ids = '${oldIds.toString()}' WHERE company_id = ${companyId}`;

  dbMysql.query(query)
    .then(res => console.log(res))
    .catch(err => console.log(err));
}

module.exports = {
  updateColumn,
  createColumn,
  updateColumnTaskIds,
};
