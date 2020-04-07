import moment from "moment";
import {
  parseIntWithSpaces,
  Parser,
  regExResolver,
  regExResolverAccumulator,
  regExResolverPostTransform,
  regExResolverSingle,
  sanitizeExtraSpaces,
  sanitizeNewLines
} from "./parser-assistant";
import * as countryAssistant from "./country-assistant";

const graphAssistant = require("./graph-assistant");
const crawler = require('crawler-request');
const csv = require('csvtojson')
const hash = require('object-hash');

const findParseURLForTrendId = (timestamp, timestampURL) => {
  const beginningOfReportstimetamp = moment('20200120', 'YYYYMMDD');
  const reportIndex = timestamp.diff(beginningOfReportstimetamp, 'days');
  if (reportIndex < 1 || isNaN(reportIndex)) {
    throw "Invalid date selected for report";
  }
  let mainURL = 'https://www.who.int/docs/default-source/coronaviruse/situation-reports/';

  // Well this is a weird case WHO... They've totally got the wrong URL :O
  if (timestampURL === "20200312") {
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
  constructor(trendId, username, text, graphType, defaultXValue) {
    this.trendId = trendId;
    this.username = username;
    this.traces = "";
    this.graphQueries = [];
    this.graphQueriesMap = {};
    this.parser = new Parser(text);
    this.graphType = graphType;
    this.defaultXValue = defaultXValue;
  }

  dataEntry(graph, value) {
    const query = {
      trendId: this.trendId,
      username: this.username,
      title: graph.title,
      label: graph.label,
      subLabel: graph.subLabel,
      type: this.graphType,
      dataSequence: graph.dataSequence
    };
    const ivalue = {
      x: moment(value.x).valueOf(),
      y: Number(value.y)
    };
    const qhash = hash(query);

    if (this.graphQueriesMap[qhash]) {
      this.graphQueriesMap[qhash].values.push(ivalue)
    } else {
      this.graphQueriesMap[qhash] = {
        ...query,
        values: [ivalue]
      };
    }

    // this.graphQueries.push({
    //     value : ivalue,
    //     query
    //   }
    // );
  }

  checkTimeStampValid(validRange, currTime) {
    if (validRange === undefined) return true;
    const from = moment(validRange.from, "YYYYMMDD");
    const to = moment(validRange.to, "YYYYMMDD");
    return currTime.isBetween(from, to, null, '[]');
  }

  applyCountryPostTransformRule(source) {
    return countryAssistant.findSimple(sanitizeExtraSpaces(sanitizeNewLines(source)));
  }

  applyPostTransformRule(pbt, match) {
    if (pbt.algo === "matchCountryName") {
      return this.applyCountryPostTransformRule(match);
    }
    return match;
  }

  finaliseCrunch(key, title, xValue, wc, dataSequence = null) {
    const graphElem = graphAssistant.declare(this.graphType, key, title, "", dataSequence);
    const value = graphAssistant.prepareSingleValue(graphElem.type, xValue, wc);
    this.dataEntry(graphElem, value);
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

    if (action.regex) {
      let results = [];
      const resolver = regExResolver(action.regex);
      const regex = makeRegExpFromJSON(action.regex);
      if (resolver === regExResolverSingle) {
        const parsedData = nparse.find(regex);
        if (!parsedData || parsedData.length === 0) throw "Error parsing";
        results.push({y: parseIntWithSpaces(parsedData[1]), title});
      } else if (resolver === regExResolverAccumulator) {
        results.push({y: nparse.findAllAccumulate(regex), title});
      } else if (resolver === regExResolverPostTransform) {
        for (const r of nparse.findAll(regex)) {
          results.push(await this.applyPost(r, action.postTransform, title));
        }
      }

      for (const result of results) {
        this.finaliseCrunch(key, result.title, this.defaultXValue, result.y);
      }
    } else if (action.csv) {
      const resjson = await csv().fromString(nparse.text);
      for (const elem of resjson) {
        // If label is present in the csv raw then used it, otherwise it as the string specified in the json field 'label'
        const cvsLabelField = elem[action.csv.label] ? elem[action.csv.label] : action.csv.label;
        this.finaliseCrunch(key, cvsLabelField, elem[action.csv.x], elem[action.csv.y], action.dataSequence);
      }
    }
  }

  async crunchGroups(resjson, group, defaultXValue, dataSequence) {
    for (const elem of resjson) {
      // If label is present in the csv raw then used it, otherwise it as the string specified in the json field 'label'
      let cvsLabelField = elem[group.label] ? elem[group.label] : group.label;
      if ( group.labelTransform && group.labelTransform == "Country" ) {
        cvsLabelField = this.applyCountryPostTransformRule(cvsLabelField);
      }
      const xValue = elem[group.x] ? elem[group.x] : defaultXValue;
      this.finaliseCrunch(group.key, cvsLabelField, xValue, elem[group.y], dataSequence);
    }
  }

  async crunch(query) {
    const nparse = new Parser(this.parser.text);
    const resjson = await csv().fromString(nparse.text);
    for (const group of query.groups) {
      await this.crunchGroups(resjson, group, this.defaultXValue, query.dataSequence);
    }

    // Remap to array
    for ( const elem in this.graphQueriesMap ) {
      this.graphQueries.push(this.graphQueriesMap[elem]);
    }

    // Sanitize if needed
    // Sanitize cumulative
    this.graphQueries.forEach( elem => {
      if (elem.values.length > 1 && elem.dataSequence === "Cumulative") {
        for (let i = 1; i < elem.values.length; i++) {
          if (elem.values[i].y === 0 && elem.values[i - 1].y > 0 &&
            elem.values[i].x !== 0 && elem.values[i - 1].x ) {
            elem.values[i].y = elem.values[i - 1].y;
          }
        }

        let red = {};
        for ( const v of elem.values ) {
          if ( !red[v.x] ) red[v.x] = 0;
          red[v.x] += v.y;
        }
        elem.values = [];
        // Remap to red
        for ( const e in red ) {
          elem.values.push({ x:parseInt(e), y:red[e]});
        }
      }
      this.traces += (elem.title + ", " + elem.label + ", " + JSON.stringify(elem.values) + "\n");
    });

    return {
      traces: this.traces,
      graphQueries: this.graphQueries
    }
  }

}

// {
//   "groups": [
//   {
//     "key": "Cases",
//     "label": "Country/Region",
//     "x": "$timestamp",
//     "y": "Confirmed"
//   },
//   {
//     "key": "Deaths",
//     "label": "Country/Region",
//     "x": "$timestamp",
//     "y": "Deaths"
//   },
//   {
//     "key": "Recovered",
//     "label": "Country/Region",
//     "x": "$timestamp",
//     "y": "Recovered"
//   }
// ],
//   "sourceDocument": "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/01-22-2020.csv",
//   "timestamp": "01/22/2020",
//   "timestampFormat": "MM-DD-YYYY",
//   "dataSequence": "Cumulative",
//   "version": "v3"
// }
