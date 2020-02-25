const mongoose = require("mongoose");

module.exports = mongoose.model("dataset", new  mongoose.Schema({}, { strict: false }));

