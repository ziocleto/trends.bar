const mongoose = global.db;

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
