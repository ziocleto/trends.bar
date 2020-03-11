const mongoose = require("mongoose");

export const datasetModel = mongoose.model("dataset", new mongoose.Schema({
  source: {type: String},
  sourceDocuments: [String],
  sourceName: {type: String},
  trendId: {type: mongoose.Schema.Types.ObjectId, ref: 'trends', _id: true}
}, {strict: false}));

export const graphLayoutModel = mongoose.model("graph_layout", new mongoose.Schema({}, {strict: false}));

export const trendGraphsModel = mongoose.model("trend_graphs", new mongoose.Schema({
  trendId: {type: mongoose.Schema.Types.ObjectId, ref: 'trends', _id: true},
  values: [[Number]],
  dataset: {type: mongoose.Schema.Types.ObjectId, ref: 'dataset', _id: false},
  graph: {type: mongoose.Schema.Types.ObjectId, ref: 'graph_layout'}
}, {strict: false}));

export const trendsModel = mongoose.model("trends", new mongoose.Schema({}, {strict: false}));
