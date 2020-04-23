import {MongoDataSource} from "apollo-datasource-mongodb";

const logger = require("eh_logger");

const dbi = require("eh_db");

export class MongoDataSourceExtended extends MongoDataSource {
  async get() {
    return await this.model.find({}).collation({locale: "en", strength: 2});
  }

  async find(query) {
    return await this.model.find(query).collation({locale: "en", strength: 2});
  }

  async remove(query) {
    await this.model.remove(query).collation({locale: "en", strength: 2});
    return "OK";
    // The result of remove is a find of the remaining documents, this might change
    // return this.model.find({});
  }

  async removeWithFinalAllReturn(query, retQuery) {
    await this.model.remove(query).collation({locale: "en", strength: 2});
    // The result of remove is a find of the remaining documents, this might change
    return this.model.find(retQuery).collation({locale: "en", strength: 2});
  }

  async findSimilar(query) {
    return await this.model.find({trendId: {"$regex": query.trendId, "$options": "i"}});
  }

  async findSimilarAndDistinct(query) {
    const res = await this.model.aggregate([
      {$project: {"values": 0}},
      {
        $match: {
          trendId: {"$regex": query.trendId, "$options": "i"},
        }
      },
      {
        $group: {
          _id: "$trendId",
          count: {$sum: 1},
          trendId: {
            $addToSet: "$trendId"
          },
          username: {
            $addToSet: "$username"
          }
        }
      },
      {$project: {"_id": 0}},
    ]);

    return res;
  }

  async upsertDataSource(query, dataSource) {
    const now = Date.now();
    try {
      const res0 = await this.model.findOne(
        {
          ...query,
          "dataSources.name": dataSource.name
        }
      );
      if (res0) {
        await this.model.updateOne(
          query,
          {$set: {"dataSources.$[element]": dataSource, lastUpdate: now}},
          {
            arrayFilters: [{"element.name": {$eq: dataSource.name}}]
          }
        );

      } else {
        await this.model.updateOne(
          query,
          {
            $push: {"dataSources": dataSource},
            $set: {lastUpdate: now}
          }
        );
      }

      return "ok";
    } catch (e) {
      logger.error(e);
      return null;
    }
  }

  async upsertLayout(query, gridLayout, gridContent) {
    const now = Date.now();
    const data = {
      gridLayout,
      gridContent,
      lastUpdate: now
    }
    return await this.model.updateOne(query, data);
  }

  async renameDataSource(query, oldName, newName) {
    const now = Date.now();
    try {
      return await this.model.updateOne(
        query,
        {
          $set: {
            "dataSources.$[element].name": newName,
            lastUpdate: now
          }
        },
        {
          arrayFilters: [{"element.name": {$eq: oldName}}]
        }
      );
    } catch (e) {
      logger.error(e);
      return null;
    }
  }

  async findOne(query) {
    const ret = await this.model.findOne(query).collation({locale: "en", strength: 2});
    if (!ret) return ret;
    return ret.toObject();
  }

  async findOneLastUpdate(query) {
    const timeStamp = query.lastUpdate;
    const finalQuery = {
      ...query,
      lastUpdate: timeStamp ? {$lt: timeStamp} : {$ne: timeStamp}
    }
    return await this.model.findOne(finalQuery).collation({locale: "en", strength: 2});
  }

  async updateOne(query, data) {
    const doc = await this.model.findOneAndUpdate(query, data);
    return doc.toObject();
  }

  async upsert(query, data) {
    return await dbi.upsert(this.model, query, data);
  }

  async save(query) {
    try {
      const found = await this.model.findOne(query);
      if (found) {
        return null;
      }
      const newElem = new this.model(query);
      await newElem.save();
      return query;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

}
