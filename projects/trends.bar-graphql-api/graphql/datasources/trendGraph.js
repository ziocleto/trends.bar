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

  async upsertGraphs(query) {
    for (const graph of query.graphQueries) {
      await dbi.upsertUniqueXValue(graph);
    }
    return "OK";
  }

}
