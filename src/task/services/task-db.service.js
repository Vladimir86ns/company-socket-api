const Task = require('../../shared/database/models/task.schema');

async function findTasks(query, params = {}) {
 return await Task.find(query, params).exec();
};

module.exports = {
  findTasks
};
