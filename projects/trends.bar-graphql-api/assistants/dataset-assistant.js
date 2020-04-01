import {datasetModel} from "../models/dataset";
const dbi = require("eh_db");

module.exports = {
  acquire: async (source, sourceName, sourceDocument) => {
    const res = await dbi.upsert(datasetModel, {source, sourceName, sourceDocument}, {source, sourceName, sourceDocument});
    return res.toObject();
  }
};
