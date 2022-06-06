const mongoose = require('mongoose');

const DocSchema = mongoose.Schema({
  _id: String,
  data: Object,
});

module.exports = mongoose.model('Document', DocSchema);
