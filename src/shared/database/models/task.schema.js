const { Schema, model } = require('mongoose');

const taskSchema = new Schema({
  id: String,
  title: { type: String, min: 1, max: 100 },
  description: { type: String, min: 1, max: 500 },
  author_id: { type: Number, min: 1, max: 50 },
  author_name: { type: String, max: 100 },
  assigned_ids: [Number],
  created_at: { type: String },
  column_id: { type: Schema.Types.ObjectId, ref: 'Column' },
  only_assigned_can_see: { type: Boolean, default: false },
});

module.exports = model('Task', taskSchema);
