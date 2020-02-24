const mongoose = require("mongoose");

module.exports = mongoose.model("trend", new  mongoose.Schema({}, { strict: false }));

