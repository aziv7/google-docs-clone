const mongoose = require('mongoose');

exports.connect = async () => {
  await mongoose.connect('mongodb://localhost/my_database');
};
