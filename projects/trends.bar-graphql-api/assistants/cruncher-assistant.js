import {trendGraphsModel, trendsModel} from "../models/models";
import moment from "moment";
import {
  parseIntWithSpaces,
  Parser,
  regExResolver,
  regExResolverAccumulator, regExResolverPostTransform,
  regExResolverSingle,
  sanitizeNewLines
} from "./parser-assistant";
const graphAssistant = require("./graph-assistant");
import * as countryAssistant from "./country-assistant";
const crawler = require('crawler-request');
const mongoose = require("mongoose");
const db = require("../db");

const findTrendByStringId = async (trendId) => {
  const trend = await db.findOne(trendsModel, {trendId: trendId});
  return trend._id;
}

const findParseURLForTrendId = (timestamp, timestampURL) => {
  const beginningOfReportstimetamp = moment('20200120', 'YYYYMMDD');
  const reportIndex = timestamp.diff(beginningOfReportstimetamp, 'days');
  if (reportIndex < 1 || isNaN(reportIndex)) {
    throw "Invalid date selected for report";
  }
  let mainURL = 'https://www.who.int/docs/default-source/coronaviruse/situation-reports/';

  // Well this is a weird case WHO... They've totally got the wrong URL :O
  if ( timestampURL === "20200312" ) {
    mainURL = 'https://www.who.int/docs/default-source/wrindia/situation-report/';
  }

  return `${mainURL}${timestampURL}-sitrep-${reportIndex}-covid-19.pdf`;
}

export const crawlTrendId = async (timestamp, timestampURL) => {
  const finalURL = findParseURLForTrendId(timestamp, timestampURL);
  const response = await crawler(finalURL);
  return response.text;
}

const makeRegExpFromJSON = json => {
  return RegExp(json.body, json.flags);
}

export class Cruncher {
  constructor(trendId, text, datasetElem, graphType, defaultXValue) {
    this.trendId = trendId;
    this.parser = new Parser(text);
    this.datasetElem = datasetElem;
    this.graphType = graphType;
    this.defaultXValue = defaultXValue;
  }

  async dataEntry(graph, value) {
    let data = {
      dataset: mongoose.Types.ObjectId(this.datasetElem._id),
      graph: mongoose.Types.ObjectId(graph._id),
      '$addToSet': {values: value}
    };
    const graphElem = await db.upsert(trendGraphsModel, data, {
      dataset: data.dataset,
      graph: data.graph
    });
    return await db.upsert(trendsModel, {
      '$addToSet': {trendGraphs: graphElem._id}
    }, {trendId: this.trendId});
  }

  checkTimeStampValid(validRange, currTime) {
    if (validRange === undefined) return true;
    const from = moment(validRange.from, "YYYYMMDD");
    const to = moment(validRange.to, "YYYYMMDD");
    return currTime.isBetween(from, to, null, '[]');
  }

  applyCountryPostTransformRule(source) {
    return countryAssistant.findSimple(sanitizeNewLines(source));
  }

  applyPostTransformRule(pbt, match) {
    if (pbt.algo === "matchCountryName") {
      return this.applyCountryPostTransformRule(match);
    }
    return match;
  }

  async finaliseCrunch(key, title, wc) {
    const graphElem = await graphAssistant.acquire(this.graphType, key, title);
    const value = graphAssistant.prepareSingleValue(graphElem.type, this.defaultXValue, wc);
    console.log(key, title + ", " + wc);
    return await this.dataEntry(graphElem, value);
  }

  getParserStartIndex(regex) {
    if (regex) {
      const pbr = makeRegExpFromJSON(regex);
      return this.parser.findIndex(pbr);
    }
    return 0;
  }

  getParserEndIndex(regex) {
    if (regex) {
      const pbr = makeRegExpFromJSON(regex);
      return this.parser.findIndex(pbr);
    }
    return this.parser.text.length;
  }

  async applyPost(match, pbt, title) {
    let r1 = title;
    let r2 = match[1];
    if (pbt) {
      const elem = this.applyPostTransformRule(pbt, match[pbt.sourceIndex]);
      const titleFinal = title.replace(pbt.dest, elem);
      r1 = titleFinal;
      r2 = match[pbt.valueIndex];
    }
    return {title: r1, y: parseIntWithSpaces(r2)}
  }

  async crunchAction(key, title, action) {
    const nparse = new Parser(this.parser.text.substring(this.getParserStartIndex(action.startRegex),
      this.getParserEndIndex(action.endRegex)));

    let results = [];
    const resolver = regExResolver(action.regex);
    const regex = makeRegExpFromJSON(action.regex);
    if (resolver === regExResolverSingle) {
      const parsedData = nparse.find(regex);
      results.push( { y: parseIntWithSpaces(parsedData[1]), title });
    } else if (resolver === regExResolverAccumulator) {
      results.push( { y: nparse.findAllAccumulate(regex), title });
    } else if (resolver === regExResolverPostTransform) {
      for (const r of nparse.findAll(regex)) {
        results.push( await this.applyPost(r, action.postTransform, title) );
      }
    }

    for ( const result of results ) {
      await this.finaliseCrunch(key, result.title, result.y);
    }

  }

  async crunchFunctions(f, xValue) {
    for (const dataset of f.datasets) {
      const title = dataset.title;
      for (const action of dataset.actions) {
        if (this.checkTimeStampValid(action.validRange, xValue)) {
          this.crunchAction(f.key, title, action);
          break;
        }
      }
    }
  }

  async crunch(query) {
    for (const f of query.functions) {
      await this.crunchFunctions(f, this.defaultXValue);
    }
  }
}
