const { Schema, model } = require('mongoose');

const taskSchema = new Schema({
  id: String,
  title: { type: String, min: 1, max: 100 },
  description: { type: String, min: 1, max: 500 },
  column: { type: Schema.Types.ObjectId, ref: 'Column' }
});

module.exports = model('Task', taskSchema);
