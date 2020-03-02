const mongoose = require("mongoose");
const db = require("../db");
const graphAssistant = require("../assistants/graph-assistant");

const dataEntry = async (datasetId, graphId, value) => {
  let data = {
    datasetId: datasetId,
    graphId: graphId,
    '$addToSet': {values: value}
  };
  return await db.upsert(trendModel, data, {
    datasetId: data.datasetId,
    graphId: data.graphId
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

  parse: async (parser) => {

    const {dataset, graph, regEx, inputs} = parser;

    const datasetElem = await db.upsert(datasetModel, dataset);
    const graphElem = await db.upsert(graphLayoutModel, graph);

    const resultResolved = regEx.parseFunction(module.exports.regexFind(regEx));

    const value = graphAssistant.prepareValue(graph.type, inputs, resultResolved);

    return await dataEntry(mongoose.Types.ObjectId(datasetElem._id), mongoose.Types.ObjectId(graphElem._id), value);
  }

};
