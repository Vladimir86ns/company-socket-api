const { Schema, model } = require('mongoose');

const columnSchema = new Schema({
  id: String,
  title: { type: String, min: 1, max: 100 },
  company_id: { type: Number, min: 1, max: 50 },
  tasks: [{type: Schema.Types.ObjectId, ref: 'Tasks' }],
});

module.exports = model('Column', columnSchema);
