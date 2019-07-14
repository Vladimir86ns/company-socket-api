const { Schema, model } = require('mongoose');

const columnSchema = new Schema({
  id: String,
  title: { type: String, min: 1, max: 100, required:[true] },
  company_id: { type: Number, min: 1, max: 50 },
  account_id: { type: Number, min: 1, max: 50 },
});

module.exports = model('Column', columnSchema);
