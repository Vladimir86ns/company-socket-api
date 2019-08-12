const Column = require('../../shared/database/models/column.schema');
const Task = require('../../shared/database/models/task.schema');
const taskDBService = require('./task-db.service');
const columnService = require('../../column/services/column.service');
const webSocketService = require('../../shared/websocket/websocket.service');
const { TYPE_CREATE_TASK, TYPE_UPDATE_TASK } = require('../../shared/consts/messages-types');
var moment = require('moment');

/**
 * Create new task, and update column with new task id,
 * put id on first element of array.
 * 
 * @param {object} properties
 */
async function createTask(properties) {
  properties.created_at = moment().format('lll'); 
  const task = new Task(properties);
  await task.save();
  const column = await Column.findOne({_id: properties.column_id}).exec();
  await column.update({task_ids: [task._id].concat(column.task_ids)});
  const results = await columnService.getCompanyColumns(properties.company_id);

  results.updateData = {
    message_type: TYPE_CREATE_TASK,
    new_name: properties.title
  };

  webSocketService.getConnection().emit(`${properties.column_order_id}-${column.account_id}-${properties.company_id}`, results);

  return results;
};

/**
 * Update task.
 * 
 * @param {object} properties
 */
async function updateTask(properties) {
  properties.updated_at = moment().format('lll');
  await taskDBService.updateTasks({_id: properties.task_id}, properties);

  const results = await columnService.getCompanyColumns(properties.company_id);

  results.updateData = {
    message_type: TYPE_UPDATE_TASK,
    new_name: properties.title
  };

  webSocketService.getConnection().emit(`${properties.column_order_id}-${properties.account_id}-${properties.company_id}`, results);

  return results;
}

module.exports = {
  createTask,
  updateTask,
}

