const mongoose = require("mongoose");

module.exports = mongoose.model("trend", new mongoose.Schema({
  values: [[Number]],
  datasetId: { type: mongoose.Schema.Types.ObjectId, ref: 'dataset', _id: false },
  graphId: { type: mongoose.Schema.Types.ObjectId, ref: 'graph_layout' }
}, { strict: false }));

