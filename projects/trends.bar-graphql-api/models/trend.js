const mongoose = global.db;

const schemaWithIndex = (schemaDef, index) => {
  let schema = new mongoose.Schema(schemaDef);
  schema.index(index);
  return schema;
}

export const trendModel = mongoose.model("trends",schemaWithIndex({
  trendId: {type: String},
  username: {type: String, ref: 'users.name'},
  draft: {type: Boolean},
  aliases: [{type: String}],
  gridLayout: [{
    i: {type:String},
    x: {type:Number},
    y: {type:Number},
    w: {type:Number},
    h: {type:Number},
    moved: {type:Boolean},
    static: {type:Boolean}
  }],
  gridContent: [],
  dataSources: [],
  created: {type:Date},
  lastUpdate: {type:Date}
}, { trendId: 'text' }));
