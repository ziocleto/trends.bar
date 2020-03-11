import {datasetModel} from "../models/models";
import * as db from "../db";

module.exports = {
  acquire: async (trendId, source, sourceName) => {
    const res = await db.upsert(datasetModel, {trendId, source, sourceName});
    return res.toObject();
  }
};
