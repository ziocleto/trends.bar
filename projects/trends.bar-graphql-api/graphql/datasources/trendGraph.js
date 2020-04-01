import moment from "moment";
import {Cruncher} from "../../assistants/cruncher-assistant";
import {trendModel} from "../../models/trend";
import {trendGraphModel} from "../../models/trendGraph";
import {MongoDataSourceExtended} from "./common";

const fetch = require('node-fetch');
const graphAssistant = require("../../assistants/graph-assistant");
const datasetAssistant = require("../../assistants/dataset-assistant");
const dbi = require("eh_db");

export class trendGraphDataSource extends MongoDataSourceExtended {

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
    const trend = await trendModel.findOne({trendId, username});
    if (!trend) return null;

    await trendGraphModel.deleteMany({_id: {'$in': trend.trendGraphs}});
    await trendModel.updateOne({_id: trend._id}, {$set: {trendGraphs: []}});

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
