const mongoose = require('mongoose');

module.exports = mongoose.model('users', new mongoose.Schema({
  name: {type: String, unique: true},
  email: {type: String, unique: true},
},{ "strict": false }));

