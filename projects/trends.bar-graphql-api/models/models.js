const mongoose = require("mongoose");
// const mongoose = global.db;

const schemaWithIndex = (schemaDef, index) => {
  let schema = new mongoose.Schema(schemaDef);
  schema.index(index);
  return schema;
}

export const datasetModel = mongoose.model("datasets", new mongoose.Schema({
  source: {type: String},
  sourceDocument: {type: String},
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
  valuesDx: [],
  valuesDx2: [],
  valuesDxPerc: [],
  dataset: {type: mongoose.Schema.Types.ObjectId, ref: 'datasets'},
}, {strict: false}));

export const trendsModel = mongoose.model("trends",schemaWithIndex({
  trendId: {type: String},
  username: {type: String, ref: 'users.name'},
  aliases: [{type: String}],
}, { trendId: 'text' }));

export const trendLayoutModel = mongoose.model("trend_layouts", new mongoose.Schema({
  trendId: {type: String},
  username: {type: String},
  name: {type: String},
  granularity: {type:Number},
  cols: {type:Number},
  width: {type:Number},
  gridLayout: [{
    i: {type:String},
    x: {type:Number},
    y: {type:Number},
    w: {type:Number},
    h: {type:Number},
    moved: {type:Boolean},
    static: {type:Boolean}
  }]
}, {strict: false}));
