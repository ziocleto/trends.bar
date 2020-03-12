const mongoose = require("mongoose");

export const datasetModel = mongoose.model("datasets", new mongoose.Schema({
  source: {type: String},
  sourceDocuments: [String],
  sourceName: {type: String},
}, {strict: false}));

export const graphLayoutModel = mongoose.model("graph_layouts", new mongoose.Schema({
  label: {type: String},
  subLabel: {type: String},
  type: {type: String}
}, {strict: false}));

export const trendGraphsModel = mongoose.model("trend_graphs", new mongoose.Schema({
  values: [[Number]],
  dataset: {type: mongoose.Schema.Types.ObjectId, ref: 'datasets'},
  graph: {type: mongoose.Schema.Types.ObjectId, ref: 'graph_layouts'}
}, {strict: false}));

export const trendsModel = mongoose.model("trends", new mongoose.Schema({
  trendId: {type: String},
  values: [String],
  trendGraphs: [{type: mongoose.Schema.Types.ObjectId, ref: 'trend_graphs'}]
}, {strict: false}));
