import {MongoDataSource} from "apollo-datasource-mongodb";
import moment from "moment";
import {Cruncher} from "../../assistants/cruncher-assistant";
import {trendGraphsModel, trendsModel} from "../../models/models";
const fetch = require('node-fetch');
const dbi = require("../../db");
const graphAssistant = require("../../assistants/graph-assistant");
const datasetAssistant = require("../../assistants/dataset-assistant");

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

  async removeAndRelist(query) {
    const numDocs = await this.model.countDocuments();
    await this.model.remove(query).collation({locale: "en", strength: 2});
    // The result of remove is a find of the remaining documents
    const numDocsAfterDeletion = await this.model.countDocuments();
    if (numDocs === numDocsAfterDeletion) {
      return null;
    }
    const ret = await this.model.find({});
    let res = [];
    for (const script of ret) {
      let sn = script.toObject().scriptName;
      res.push({
        filename: sn,
        text: this.cleanScriptString(script)
      });
    }
    return res;
  }

  async findSimilar(query) {
    return await this.model.find({trendId: {"$regex": query.trendId, "$options": "i"}});
  }

  async findOne(query) {
    const ret = await this.model.findOne(query).collation({locale: "en", strength: 2});
    return ret;
  }

  cleanScriptStringNoObj(ret2) {
    ret2["_id"] = null;
    delete ret2["_id"];
    delete ret2["__v"];
    delete ret2["username"];
    delete ret2["trendId"];
    delete ret2["scriptName"];
    return JSON.stringify(ret2, null, 2);
  }

  cleanScriptString(ret) {
    return this.cleanScriptStringNoObj(ret.toObject());
  }

  async findOneStringify(query) {
    const ret = await this.model.findOne(query).collation({locale: "en", strength: 2});
    return ret ? {
      filename: ret.toObject().scriptName,
      text: this.cleanScriptString(ret)
    } : null;
  }

  async findManyStringify(query) {
    const ret = await this.model.find(query).collation({locale: "en", strength: 2});
    let res = [];
    for (const script of ret) {
      let sn = script.toObject().scriptName;
      res.push({
        filename: sn,
        text: this.cleanScriptString(script)
      });
    }
    return res;
  }

  async updateOne(query, data) {
    const doc = await this.model.findOneAndUpdate(query, data);
    return doc.toObject();
  }

  async updateOneStringify(query, data) {
    // WARNING: findOneAndUpdate returns the doc _before_ the update, so basically it returns the findOne part :/ Lame
    const doc = await this.model.findOneAndUpdate(query, data);
    if (!doc) {
      return null;
    }
    const updated = await this.model.findById(doc._id);
    const ret = updated.toObject();
    return {
      filename: ret.scriptName,
      text: this.cleanScriptStringNoObj(ret)
    };
  }

  async upsert(query, data) {
    return await dbi.upsert(this.model, query, data);
  }

}

export class TrendGraphDataSource extends MongoDataSourceExtended {

  async crawlTrendGraph(script) {
    try {
      const trendId = script.trendId;
      const username = script.username;
      const timestamp = script.timestamp !== "embedded" ? moment(script.timestamp, script.timestampFormat) : script.timestamp;

      const response = await fetch(script.sourceDocument);
      const text = await response.text();
      //const text = await crawlTrendId(timestamp, script.timestamp);

      const datasetElem = await datasetAssistant.acquire(script.source, script.sourceName, script.sourceDocument);
      const cruncher = new Cruncher(trendId, username, text, graphAssistant.xyDateInt(), timestamp);

      const {traces, graphQueries} = await cruncher.crunch(script);
      return {crawledText: text, traces: traces, graphQueries: graphQueries, dataset: datasetElem};
    } catch (e) {
      return {error: e}
    }
  }

  async deleteTrendGraphs(trendId, username) {
    const trend = await trendsModel.findOne({trendId, username});
    if (!trend) return null;

    await trendGraphsModel.deleteMany({_id: {'$in': trend.trendGraphs}});
    await trendsModel.updateOne({_id: trend._id}, {$set: {trendGraphs: []}});

    return trend._id;
  }

  async upsertUniqueXValue(query) {
    let queryOnly = query;
    const values = query.values;
    delete queryOnly.values;

    const data = {
      ...query,
      $push: {
        values: {
          $each: values,
          $sort: {x: 1}
        }
      }
    };
    const ret = await dbi.upsert(this.model, queryOnly, data);

    let newValues = [];
    let newValuesDx = [];
    let newValuesDx2 = [];
    let newValuesDxPerc = [];
    for (let index = 0; index < ret.values.length - 1; index++) {
      if (ret.values[index].x !== ret.values[index + 1].x) {
        newValues.push(ret.values[index]);
      }
    }
    newValues.push(ret.values[ret.values.length - 1]);

    if (query.dataSequence === "Cumulative") {
      newValuesDx = graphAssistant.firstDerivativeOf(newValues);
      newValuesDx2 = graphAssistant.firstDerivativeOf(newValuesDx);
      newValuesDxPerc = graphAssistant.firstDerivativePercOf(newValuesDx);
    }

    await this.model.updateOne(query, {
      $set: {
        values: newValues,
        valuesDx: newValuesDx,
        valuesDxPerc: newValuesDxPerc,
        valuesDx2: newValuesDx2,
      }
    });
  }

  async upsertGraphs(query) {
    for (const graph of query.graphQueries) {
      await this.upsertUniqueXValue(graph);
    }
    return "OK";
  }

}
