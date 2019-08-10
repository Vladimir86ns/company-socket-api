const Task = require('../../shared/database/models/task.schema');

async function findTasks(query, params = {}) {
 return await Task.find(query, params).exec();
};

async function updateTasks(query, params = {}) {
  return await Task.updateOne(query, params);
 };

module.exports = {
  findTasks,
  updateTasks
};
