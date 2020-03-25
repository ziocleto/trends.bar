import {datasetModel} from "../models/models";
import * as db from "../db";

module.exports = {
  acquire: async (source, sourceName, sourceDocument) => {
    const res = await db.upsert(datasetModel, {source, sourceName, sourceDocument});
    return res.toObject();
  }
};
