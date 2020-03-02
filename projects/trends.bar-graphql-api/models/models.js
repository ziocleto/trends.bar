const mongoose = require("mongoose");

export const datasetMode = mongoose.model("dataset", new mongoose.Schema({}, {strict: false}));

export const graphLayoutModel = mongoose.model("graph_layout", new mongoose.Schema({}, {strict: false}));

export const trendGraphsModel = mongoose.model("trend_graphs", new mongoose.Schema({
  trendId: {type: String},
  values: [[Number]],
  dataset: {type: mongoose.Schema.Types.ObjectId, ref: 'dataset', _id: false},
  graph: {type: mongoose.Schema.Types.ObjectId, ref: 'graph_layout'}
}, {strict: false}));

export const trendsModel = mongoose.model("trends", new mongoose.Schema({}, {strict: false}));
