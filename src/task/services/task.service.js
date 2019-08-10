const Column = require('../../shared/database/models/column.schema');
const Task = require('../../shared/database/models/task.schema');
const columnService = require('../../column/services/column.service');
const webSocketService = require('../../shared/websocket/websocket.service');
const { TYPE_CREATE_TASK } = require('../../shared/consts/messages-types');
var moment = require('moment');

/**
 * Create new task, and update column with new task id,
 * put id on first element of array.
 * 
 * @param {string} title 
 * @param {string} description 
 * @param {number} authorId 
 * @param {number} columnId 
 * @param {string} columnOrderId 
 * @param {number} companyId 
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

module.exports = {
  createTask,
}

