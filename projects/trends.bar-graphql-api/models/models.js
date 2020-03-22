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

export const crawlingScriptModel = mongoose.model("crawling_scripts", new mongoose.Schema({
  name: {type: String},
  script: {type: String},
}, {strict: false}));

export const trendGraphsModel = mongoose.model("trend_graphs", new mongoose.Schema({
  title: {type: String},
  label: {type: String},
  subLabel: {type: String},
  type: {type: String},
  values: [],
  dataset: {type: mongoose.Schema.Types.ObjectId, ref: 'datasets'},
}, {strict: false}));

export const trendsModel = mongoose.model("trends", new mongoose.Schema({
  trendId: {type: String, unique: true},
  userId: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
  aliases: [{type: String}],
  trendGraphs: [{type: mongoose.Schema.Types.ObjectId, ref: 'trend_graphs'}]
}, {strict: false}));
