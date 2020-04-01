import {datasetModel} from "../models/dataset";

const dbi = require("eh_db");
const graphAssistant = require("../assistants/graph-assistant");

export const regExResolverSingle = "single";
export const regExResolverAccumulator = "accumulator";
export const regExResolverPostTransform = "postTransform";

export const regExResolver = ( jsonRegEx ) => {
  if ( jsonRegEx.resolver ) {
    if ( jsonRegEx.resolver === "accumulator" ) {
      return regExResolverAccumulator;
    } else if ( jsonRegEx.resolver === "postTransform" ) {
      return regExResolverPostTransform;
    }
  }
  return regExResolverSingle;
}

export const parseIntWithSpaces = (value) => {
  return parseInt(value.replace(/ /g, ''));
}

export const sanitizeNewLines = (value) => {
  return value.replace(/\n/g, ' ');
};

export const sanitizeExtraSpaces = (value) => {
  return value.replace(/\s+/g, ' ');
};

export class Parser {
  constructor(text) {
    this.text = text;
  }

  findAllAccumulate(regEx) {
    const matches = [...this.text.matchAll( regEx )];
    if ( matches.length === 0 ) {
      throw "findAllAccumulate failed";
    }

    let result = 0;
    for ( const match of matches ) {
        result += parseIntWithSpaces(match[1]);
    }
    return result;
  }

  find(regEx) {
    return this.text.match( regEx );
  }

  findAll(regEx) {
    return [...this.text.matchAll( regEx )];
  }

  findIndex(regEx) {

    const match = this.text.match( regEx );

    return match.index;
  }

  async parse(trendId, parser) {

    const {dataset, graph, regEx, inputs} = parser;

    const datasetElem = await dbi.upsert(datasetModel, dataset);
    const graphElem = await dbi.upsert(graphLayoutModel, graph);

    const resultResolved = regEx.parseFunction(module.exports.regexFind(regEx));

    const value = graphAssistant.prepareValue(graph.type, inputs, resultResolved);

    return await dataEntry(trendId, dbi.objectId(datasetElem._id), dbi.objectId(graphElem._id), value);
  }
}
