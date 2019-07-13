const Column = require('../../shared/database/models/column.schema');
const Task = require('../../shared/database/models/task.schema');

function createColumn() {
  const instance = new Column();
  instance.title = 'hello';
  instance.company_id = 1;
  instance.save(function (err) {
  });
};

async function getColumn() {
  const column =  await Column.findById('5d29a9e0c6de761eaff6ad0e', {_id: 0, __v:0}).exec();
  const results = await Task.find({column: '5d29a9e0c6de761eaff6ad0e'}, {_id:0, __v:0}).exec();

  return {
    column,
    tasks: results
  }
};

async function createTask() {
  const column = await Column.findById('5d29a9e0c6de761eaff6ad0e');

    new Task({
      title: 'Casino Royale',
      description: 'opis neki',
      column: column._id    // assign the _id from the person
    }).save();
};

module.exports = {
  getColumn,
  createColumn,
  createTask
}