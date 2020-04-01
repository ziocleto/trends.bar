const mongoose = global.db;

export const datasetModel = mongoose.model("datasets", new mongoose.Schema({
  source: {type: String},
  sourceDocument: {type: String},
  sourceName: {type: String},
}, {strict: false}));
