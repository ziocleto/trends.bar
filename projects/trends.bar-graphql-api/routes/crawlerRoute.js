const express = require("express");
const router = express.Router();
const graphAssistant = require("../assistants/graph-assistant");
const datasetAssistant = require("../assistants/dataset-assistant");
const parserAssistant = require("../assistants/parser-assistant");
const regExAssistant = require("../assistants/regex-assistant");
const crawler = require('crawler-request');
import moment from "moment";


router.get("/:trendId/:org/:what/:timestamp", async (req, res, next) => {
  try {
    const timestamp = moment(req.params.timestamp, 'YYYYMMDD');
    const beginningOfReportstimetamp = moment('20200120', 'YYYYMMDD');
    const reportIndex = timestamp.diff(beginningOfReportstimetamp, 'days');
    if ( reportIndex < 1 || isNaN(reportIndex)) {
      throw "Invalid date selected for report";
    }

    const mainURL = 'https://www.who.int/docs/default-source/coronaviruse/situation-reports/';
    const response = await crawler(`${mainURL}${req.params.timestamp}-sitrep-${reportIndex}-covid-19.pdf`);

    const text = response.text;

    const inputs = {
      values: [timestamp]
    };

    const dataset = datasetAssistant.declare(req.params.trendId, req.params.org, req.params.what);
    const casesGraph = graphAssistant.declare(graphAssistant.xyDateInt(), "Cases", "global");
    const deathsGraph = graphAssistant.declare(graphAssistant.xyDateInt(), "Deaths", "global");

    const casesRegEx = regExAssistant.declare(
      text,
      /SITUATION IN NUMBERS[\n\r\s\w\W\d\D]*Globally[\n\r\s]*(\d+\s*\d*)(\s*)confirmed/gmi,
      1,
      [1],
      parserAssistant.parseIntWithSpaces
    );

    const deathsRegEx = regExAssistant.declare(
      text,
      /(\d+\s*\d*)(\s*)(death|dead)/gmi,
      2,
      [1],
      parserAssistant.parseAddIntWithSpaces
    );

    const parsers = [{
      dataset: dataset,
      graph: casesGraph,
      regEx: casesRegEx,
      inputs: inputs
    }, {
      dataset: dataset,
      graph: deathsGraph,
      regEx: deathsRegEx,
      inputs: inputs
    }];

    let results = [];
    for (const parser of parsers) {
      const result = await parserAssistant.parse(parser);
      results.push(result);
    }

    res.send(results);
    // }
  } catch (ex) {
    console.log("Crawling error: ", ex);
    res.sendStatus(400);
  }
});

module.exports = router;
