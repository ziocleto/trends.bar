import {trendGraphsModel, trendsModel} from "../models/models";
import moment from "moment";
import {
  parseIntWithSpaces,
  Parser,
  regExResolver,
  regExResolverAccumulator,
  regExResolverPostTransform,
  regExResolverSingle, sanitizeNewLines
} from "../assistants/parser-assistant";
import * as countryAssistant from "../assistants/country-assistant";
import {crawlTrendId, Cruncher} from "../assistants/cruncher-assistant";

const express = require("express");
const router = express.Router();
const graphAssistant = require("../assistants/graph-assistant");
const datasetAssistant = require("../assistants/dataset-assistant");
const parserAssistant = require("../assistants/parser-assistant");
const regExAssistant = require("../assistants/regex-assistant");
const db = require("../db");
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey('');

router.get( "/sendemail", async (req,res) => {
  // using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs

  try {
    const msg = {
      to: 'test@example.com',
      from: 'test@example.com',
      subject: 'Sending with Twilio SendGrid is Fun',
      text: 'and easy to do anywhere, even with Node.js',
      html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    };
    await sgMail.send(msg);
    res.sendStatus(200);
  } catch (e) {
    console.log(e)
    res.sendStatus(400);
  }
});

router.get("/hm/:timestamp", async (req, res, next) => {
  try {
    await db.delete(trendGraphsModel, moment(req.body.timestamp, "YYYYMMDD"));
  } catch (e) {
    console.log("Error: ", e);
    res.sendStatus(400);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const trendId = req.body.trendId;
    const timestamp = moment(req.body.timestamp, req.body.timestampFormat);
    const text = await crawlTrendId(timestamp, req.body.timestamp);

    const datasetElem = await datasetAssistant.acquire(req.body.source, req.body.sourceName);
    const cruncher = new Cruncher(trendId, text, datasetElem, graphAssistant.xyDateInt(), timestamp);

    await cruncher.crunch(req.body);

    res.send("OK");
  } catch
    (ex) {
    console.log("Crawling error: ", ex);
    res.sendStatus(400);
  }
});

module.exports = router;
