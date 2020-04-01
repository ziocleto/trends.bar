const mongoose = global.db;

export const crawlingScriptModel = mongoose.model("crawling_scripts", new mongoose.Schema({
  script: {type: String},
}, {strict: false}));
