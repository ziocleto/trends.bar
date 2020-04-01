const mongoose = global.db;

export const trendGraphModel = mongoose.model("trend_graphs", new mongoose.Schema({
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
