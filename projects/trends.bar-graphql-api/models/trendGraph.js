const mongoose = global.db;

export const trendGraphModel = mongoose.model("trend_graphs", new mongoose.Schema({
  trendId: {type: String},
  username: {type: String},
  yValueName: {type: String},
  yValueSubGroup: {type: String},
  yValueGroup: {type: String},
  type: {type: String},
  values: [],
}, {strict: false}));
