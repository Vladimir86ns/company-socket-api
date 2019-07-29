const { Schema, model } = require('mongoose');

const columnOrderSchema = new Schema({
  company_id: { type: Number, min: 1, max: 50 },
  column_ids: [{ type: String }],
});

module.exports = model('ColumnOrder', columnOrderSchema);
