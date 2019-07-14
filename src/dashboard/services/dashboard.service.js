const Column = require('../../shared/database/models/column.schema');
const Task = require('../../shared/database/models/task.schema');

function createColumn(title, company_id, account_id) {
  const column = new Column({ title, company_id, account_id });
  column.save();

  return column;
};

function createTask(title, description, author_id, column_id ) {
  const task = new Task({ title, description, author_id, column_id });
  task.save();

  return task;
};

async function getCompanyColumns(company_id) {
  // TODO find better way to get all company columns with tasks
  const columns = await Column.find({company_id}, { __v:0 }).exec();
  const results1 = await Task.find({column_id: columns[0]._id}, { __v:0 }).exec();

  return [
    { column: columns[0], tasks: results1 }
  ];
};

module.exports = {
  getCompanyColumns,
  createColumn,
  createTask
}