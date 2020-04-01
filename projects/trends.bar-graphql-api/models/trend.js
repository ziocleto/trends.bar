const mongoose = global.db;

const schemaWithIndex = (schemaDef, index) => {
  let schema = new mongoose.Schema(schemaDef);
  schema.index(index);
  return schema;
}

export const trendModel = mongoose.model("trends",schemaWithIndex({
  trendId: {type: String},
  username: {type: String, ref: 'users.name'},
  aliases: [{type: String}],
}, { trendId: 'text' }));
