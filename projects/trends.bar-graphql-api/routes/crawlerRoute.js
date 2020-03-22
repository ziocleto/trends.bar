const mongoose = require("mongoose");
import {trendGraphsModel, trendsModel} from "../models/models";
import moment from "moment";
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

router.get("/sendemail", async (req, res) => {
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

export const testvaluesModel = mongoose.model("testvalues", new mongoose.Schema({
  values: [],
}, {strict: false}));

router.put("/sort/:v1/:v2", async (req, res, next) => {
    try {

      const data = {
        $push: {
          values: {
            $each: [
              {
                x: parseInt(req.params.v1),
                y: parseInt(req.params.v2)
              }
            ],
            $sort: { x: 1 }
          }
        }
      };
      const ret = await db.upsert(testvaluesModel, data, {"_id": mongoose.Types.ObjectId("5e736d0549d60c52b755bb44")});

      let setValues = [];
      for ( let index = 0; index < ret.values.length-1; index++ ) {
        if ( ret.values[index].x !== ret.values[index+1].x ) {
          setValues.push( ret.values[index] );
        }
      }
      setValues.push(ret.values[ret.values.length-1]);

      await testvaluesModel.updateOne({"_id": mongoose.Types.ObjectId("5e736d0549d60c52b755bb44")},
        { $set: {values: setValues}});

      res.sendStatus(200);
    } catch
      (e) {
      console.log("Error: ", e);
      res.sendStatus(400);
    }
  }
);

router.get("/sort", async (req, res, next) => {
  try {
    const ret = await testvaluesModel.find({});
    console.log(ret);
    res.send(ret);
  } catch (e) {
    console.log("Error: ", e);
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

router.delete("/:trendId", async (req, res, next) => {
  try {
    const trend = await trendsModel.find( {trendId: req.params.trendId} );
    console.log(trend);
    res.sendStatus(200);
  } catch (ex) {
    console.log("Error: ", ex);
    res.sendStatus(400);
  }
});

module.exports = router;
