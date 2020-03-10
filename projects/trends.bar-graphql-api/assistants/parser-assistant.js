import {datasetModel, graphLayoutModel, trendGraphsModel} from "../models/models";

const mongoose = require("mongoose");
const db = require("../db");
const graphAssistant = require("../assistants/graph-assistant");

const dataEntry = async (trendId, datasetId, graphId, value) => {
  let data = {
    dataset: datasetId,
    graph: graphId,
    '$addToSet': {values: value}
  };
  return await db.upsert(trendGraphsModel, data, {
    trendId,
    dataset: data.dataset,
    graph: data.graph
  });
}

module.exports = {

  parseIntWithSpaces: value => {
    if (value.length === 0) throw "Parsing empty array in crawling";
    return parseInt(value[0].replace(/ /g, ''));
  },

  parseAddIntWithSpaces: value => {
    if (value.length === 0) throw "Parsing empty array in crawling";
    let total = 0;
    return value.reduce((total, num) => {
      return parseInt(total) + parseInt(num.replace(/ /g, ''));
    });
  },

  regexFind: regEx => {

    let m;
    let results = [];

    while ((m = regEx.expression.exec(regEx.source)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (m.index === regEx.lastIndex) {
        regex.lastIndex++;
      }
      // The result can be accessed through the `m`-variable.
      m.forEach((match, groupIndex) => {
        if (regEx.resultIndices.includes(groupIndex)) {
          results.push(match);
        }
      });
    }

    if (results.length < regEx.expectedResultCount) {
      throw "RegEx find failed";
    }

    return results;
  },

  parse: async (trendId, parser) => {

    const {dataset, graph, regEx, inputs} = parser;

    const datasetElem = await db.upsert(datasetModel, dataset);
    const graphElem = await db.upsert(graphLayoutModel, graph);

    const resultResolved = regEx.parseFunction(module.exports.regexFind(regEx));

    const value = graphAssistant.prepareValue(graph.type, inputs, resultResolved);

    return await dataEntry(trendId, mongoose.Types.ObjectId(datasetElem._id), mongoose.Types.ObjectId(graphElem._id), value);
  }

};
