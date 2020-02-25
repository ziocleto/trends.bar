const mongoose = require("mongoose");

module.exports = mongoose.model("graph_layout", new  mongoose.Schema({}, { strict: false }));

