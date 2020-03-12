import {datasetModel} from "../models/models";
import * as db from "../db";

module.exports = {
  acquire: async (source, sourceName) => {
    const res = await db.upsert(datasetModel, {source, sourceName});
    return res.toObject();
  }
};
