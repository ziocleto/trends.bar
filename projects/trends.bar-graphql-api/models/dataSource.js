const mongoose = global.db;

export const dataSourceModel = mongoose.model("data_sources", new mongoose.Schema({
  name: {type: String},
  sourceDocument: {type: String},
  trendId: {type: String},
  username: {type: String},
  headers: [],
  sourceData: [[]]
}, {strict: false}));
