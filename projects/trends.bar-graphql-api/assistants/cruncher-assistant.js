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
  constructor(trendId, username, resjson, graphType, defaultXValue) {
    this.trendId = trendId;
    this.username = username;
    this.traces = "";
    this.graphQueries = [];
    this.graphQueriesMap = {};
    this.resjson = resjson;
    this.graphType = graphType;
    this.defaultXValue = defaultXValue;
  }

  dataEntry(graph, value) {
    const query = {
      trendId: this.trendId,
      username: this.username,
      yValueName: graph.yValueName,
      yValueSubGroup: graph.yValueSubGroup,
      yValueGroup: graph.yValueGroup,
      type: this.graphType,
    };
    const ivalue = {
      x: Date.parse(value.x),
      y: Number(value.y)
    };
    const qhash = hash(query);

    if (this.graphQueriesMap[qhash]) {
      let addValue = false;
      for ( let elem of this.graphQueriesMap[qhash].values ) {
        if ( elem.x === ivalue.x ) {
          elem.y += ivalue.y;
          addValue = true;
          break;
        }
      }
      if ( !addValue) {
        this.graphQueriesMap[qhash].values.push(ivalue)
      }
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

  finaliseCrunch(group, subGroup, xValue, yValue) {
    const key = yValue.key;
    const groupName = group.yValueGroup;
    const graphElem = graphAssistant.declare(this.graphType, key, subGroup, groupName);
    const value = graphAssistant.prepareSingleValue(graphElem.type, xValue, yValue.y);
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

  async applyPost(match, pbt, yValueName) {
    let r1 = yValueName;
    let r2 = match[1];
    if (pbt) {
      const elem = this.applyPostTransformRule(pbt, match[pbt.sourceIndex]);
      const titleFinal = yValueName.replace(pbt.dest, elem);
      r1 = titleFinal;
      r2 = match[pbt.valueIndex];
    }
    return {yValueName: r1, y: parseIntWithSpaces(r2)}
  }

  // async crunchAction(key, yValueName, action) {
  //   const nparse = new Parser(this.parser.text.substring(this.getParserStartIndex(action.startRegex),
  //     this.getParserEndIndex(action.endRegex)));
  //
  //   if (action.regex) {
  //     let results = [];
  //     const resolver = regExResolver(action.regex);
  //     const regex = makeRegExpFromJSON(action.regex);
  //     if (resolver === regExResolverSingle) {
  //       const parsedData = nparse.find(regex);
  //       if (!parsedData || parsedData.length === 0) throw "Error parsing";
  //       results.push({y: parseIntWithSpaces(parsedData[1]), yValueName});
  //     } else if (resolver === regExResolverAccumulator) {
  //       results.push({y: nparse.findAllAccumulate(regex), yValueName});
  //     } else if (resolver === regExResolverPostTransform) {
  //       for (const r of nparse.findAll(regex)) {
  //         results.push(await this.applyPost(r, action.postTransform, yValueName));
  //       }
  //     }
  //
  //     for (const result of results) {
  //       this.finaliseCrunch(key, result.yValueName, this.defaultXValue, result.y);
  //     }
  //   } else if (action.csv) {
  //     const resjson = await csv().fromString(nparse.text);
  //     for (const elem of resjson) {
  //       // If yValueSubGroup is present in the csv raw then used it, otherwise it as the string specified in the json field 'yValueSubGroup'
  //       const cvsLabelField = elem[action.csv.yValueSubGroup] ? elem[action.csv.yValueSubGroup] : action.csv.yValueSubGroup;
  //       this.finaliseCrunch(key, cvsLabelField, elem[action.csv.x], elem[action.csv.y]);
  //     }
  //   }
  // }

  async crunchGroups(group, xValues, yValues) {
    for (const elem of this.resjson) {
      let subGroup = elem[group.yValueGroup];
      if ( subGroup && subGroup.length > 0 ) {
        if ( group.labelTransform && group.labelTransform === "Country" ) {
          subGroup = this.applyCountryPostTransformRule(subGroup);
        }
        // Loop for every x values candidates found
        for ( const xv of xValues ) {
          const xValue = elem[xv.x];
          // Loop for every y values candidates found
          for ( const yv of yValues ) {
            const yValue = {
              y: elem[yv.y],
              key: yv.key
            };
            this.finaliseCrunch(group, subGroup, xValue, yValue);
          }
        }
      }
    }
  }

  async crunch(script) {
    for (const group of script.keys.group) {
      await this.crunchGroups(group, script.keys.x, script.keys.y);
    }

    // Remap to array
    for ( const elem in this.graphQueriesMap ) {
      this.graphQueries.push(this.graphQueriesMap[elem]);
    }

    // Sanitize if needed
    // Sanitize cumulative
    // this.graphQueries.forEach( elem => {
    //   if (elem.values.length > 1 && elem.cumulative) {
    //     for (let i = 1; i < elem.values.length; i++) {
    //       if (elem.values[i].y === 0 && elem.values[i - 1].y > 0 &&
    //         elem.values[i].x !== 0 && elem.values[i - 1].x ) {
    //         elem.values[i].y = elem.values[i - 1].y;
    //       }
    //     }
    //
    //     let red = {};
    //     for ( const v of elem.values ) {
    //       if ( !red[v.x] ) red[v.x] = 0;
    //       red[v.x] += v.y;
    //     }
    //     elem.values = [];
    //     // Remap to red
    //     for ( const e in red ) {
    //       elem.values.push({ x:parseInt(e), y:red[e]});
    //     }
    //   }
    //   this.traces += (elem.yValueName + ", " + elem.yValueSubGroup + ", " + JSON.stringify(elem.values) + "\n");
    // });

    return this.graphQueries;
  }
}

// {
//   "source": "https://github.com/CSSEGISandData/COVID-19",
//   "sourceDocument": "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/$timestamp.csv",
//   "timestamp": "$timestamp",
//   "timestampFormat": "MM-DD-YYYY",
//   "urlParser": "documentDirect",
//   "version": "v3",
//   "dataSequence": "Cumulative",
//   "groups": [
//   {
//     "yValueSubGroup": "Country/Region",
//     "labelTransform": "Country",
//     "key": "Cases",
//     "x": "$timestamp",
//     "y": "Confirmed"
//   },
//   {
//     "yValueSubGroup": "Country/Region",
//     "labelTransform": "Country",
//     "key": "Deaths",
//     "x": "$timestamp",
//     "y": "Deaths"
//   },
//   {
//     "yValueSubGroup": "Country/Region",
//     "labelTransform": "Country",
//     "key": "Recovered",
//     "x": "$timestamp",
//     "y": "Recovered"
//   }
// ]
// }
