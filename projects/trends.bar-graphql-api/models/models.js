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
  script: {type: String},
}, {strict: false}));

export const trendGraphsModel = mongoose.model("trend_graphs", new mongoose.Schema({
  trendId: {type: String},
  username: {type: String},
  title: {type: String},
  label: {type: String},
  subLabel: {type: String},
  type: {type: String},
  values: [],
  dataset: {type: mongoose.Schema.Types.ObjectId, ref: 'datasets'},
}, {strict: false}));

export const trendsModel = mongoose.model("trends", new mongoose.Schema({
  trendId: {type: String, unique: true},
  username: {type: String, unique: true, red: 'users.name'},
  aliases: [{type: String}],
}, {strict: false}));
