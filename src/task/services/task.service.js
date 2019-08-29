const dbMysql = require('../../shared/database-mysql');
const dashboardService = require('../../dashboard/services/dashboard.service');
const webSocketService = require('../../shared/websocket/websocket.service');
const { TYPE_CREATE_TASK, TYPE_UPDATE_TASK } = require('../../shared/consts/messages-types');
const isEmpty = require('lodash/isEmpty');

/**
 * Create new task, and update column with new task id,
 * put id on first element of array.
 * 
 * @param {object} properties
 */
async function createTask(properties) {
  const assignedIds = !isEmpty(properties.assigned_ids) ? `${properties.assigned_ids.toString()}` : null;
  
  const query = `
    INSERT INTO tasks (
      title,
      description,
      author_id,
      author_name,
      assigned_ids,
      column_id,
      only_assigned_can_see,
      created_at
    )
    VALUES (
      '${properties.title}',
      '${properties.description}',
      ${properties.author_id},
      '${properties.author_name}',
      '${assignedIds}',
      (
        SELECT id
        FROM columns
        WHERE id = ${properties.column_id}
      ),
      ${properties.only_assigned_can_see},
      CURRENT_TIMESTAMP
    )
  `;

  await dbMysql.query(query)
    .then(async res => getAndUpdateColumnWithTaskIds(res.insertId, properties.column_id))
    .catch(err => console.log(err));

  const newResults = await dashboardService.getCompanyDashboard(properties.company_id)
  
  newResults.updateData = {
    message_type: TYPE_CREATE_TASK,
    new_name: properties.title
  };

  webSocketService.getConnection().emit(`${properties.column_order_id}-${properties.account_id}-${properties.company_id}`, newResults);

  return newResults;
};

/**
 * Update task.
 * 
 * @param {object} properties
 */
async function updateTask(properties) {
  const assignedIds = !isEmpty(properties.assigned_ids) ? `${properties.assigned_ids.toString()}` : null;
  const query = `
    UPDATE tasks 
    SET 
      title = '${properties.title}',
      description = '${properties.description}',
      assigned_ids = '${assignedIds}',
      only_assigned_can_see = ${properties.only_assigned_can_see},
      updated_by_id = ${parseInt(properties.updated_by_id)},
      updated_by_name = '${properties.updated_by_name}',
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ${parseInt(properties.task_id)}
  `;

  await dbMysql.query(query)
    .then(res => console.log('task is updated', res))
    .catch(err => console.log(err));

  const results = await dashboardService.getCompanyDashboard(properties.company_id);

  results.updateData = {
    message_type: TYPE_UPDATE_TASK,
    new_name: properties.title
  };

  webSocketService.getConnection().emit(`${properties.column_order_id}-${properties.account_id}-${properties.company_id}`, results);

  return results;
}

async function getAndUpdateColumnWithTaskIds(newId, columnId) {
  const query = `SELECT task_ids FROM columns WHERE id = ${columnId}`

  await dbMysql.query(query)
  .then(async res => updateColumnWithTaskIds(newId, res[0].task_ids, columnId))
  .catch(err => console.log(err));
}

async function updateColumnWithTaskIds(newId, allIds, columnId) {
  const oldIds = allIds ? allIds.split(",") : [];
  const idsForQuery = [newId].concat(oldIds);
  const query = `UPDATE columns SET task_ids = '${idsForQuery.toString()}' WHERE id = ${columnId}`;

  await dbMysql.query(query)
    .then(res => console.log('columns is updated', res))
    .catch(err => console.log(err));
}

module.exports = {
  createTask,
  updateTask,
}

