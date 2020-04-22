'use strict';

import {Cruncher} from "../assistants/cruncher-assistant";
import * as graphAssistant from "../assistants/graph-assistant";
import {dataSourceModel} from "../models/dataSource";
import {trendGraphModel} from "../models/trendGraph";
import {lastPathElement, secondToLastPathElement} from "eh_helpers";

const express = require("express");
const logger = require("eh_logger");
const fetch = require('node-fetch');
const csv = require('csvtojson');
const db = require('eh_db');

const router = express.Router();

const csvElementTypes = {
  generic: 'Generic',
  number: 'Number',
  date: 'Date',
  country: 'Country'
};

const getDefaultLabelTransformOf = (group) => {
  if (group.toLowerCase().includes(csvElementTypes.country)) {
    return csvElementTypes.country;
  }
  return csvElementTypes.generic;
};

const checkIfNumberSequence = (resjson, vk) => {
  for (let index = 1; index < resjson.length; index++) {
    if (isNaN(Number(resjson[index][vk]))) return false;
  }
  return true;
};

const checkIfDateSequence = (resjson, vk) => {
  for (let index = 1; index < resjson.length; index++) {
    if (isNaN(Date.parse(resjson[index][vk]))) return false;
  }
  return true;
};

const fetchURL = async (url) => {
  const response = await fetch(url);
  if (response.status < 200 || response.status > 299) {
    throw `${url} ${response.statusText}`;
  }
  const text = await response.text();
  if (!text) {
    throw "Response is empty";
  }
  return text;
};

const fetchCSV = async (url) => {
  const text = await fetchURL(url);
  const resjson = await csv().fromString(text);
  if (resjson.length < 2) {
    throw "CSV doesn't contain any data";
  }
  return resjson;
};

const getCSVKeys = (resjson) => {
  let headers = [];
  const headersL = Object.keys(resjson[0]);
  for (const vk of headersL) {
    let elem = {
      name: vk,
      displayName: vk
    };
    if (checkIfNumberSequence(resjson, vk)) {
      elem.key = "y";
      elem.type = csvElementTypes.number;
    } else if (checkIfDateSequence(resjson, vk)) {
      elem.key = "x";
      elem.type = csvElementTypes.date;
    } else {
      elem.key = "z";
      elem.type = getDefaultLabelTransformOf(vk);
    }
    headers.push(elem);
  }
  return headers;
};

const createDefaultScript = (url, trendId, username) => {
  return {
    name: lastPathElement(url),
    sourceDocument: url,
    trendId,
    username,
  };
};

const runScript = async (script) => {
  script.sourceData = await fetchCSV(script.sourceDocument);
  // if (!script.keys) {
    script = {
      ...script,
      headers:getCSVKeys(script.sourceData)
    }
  // }
  return script;
  // const cruncher = new Cruncher(script.trendId, script.username, resjson, graphAssistant.xyDateInt(), "embedded");
  // const graphQueries = null;//await cruncher.crunch(script);
  // return {script, crawledText: resjson, graphQueries, error: null};
};

const findAllToArray = (retO) => {
  let ret = [];
  for (let elem of retO) {
    ret.push(elem.toObject());
  }
  return ret;
};

router.get("/scripts/:trendId", async (req, res, next) => {
  try {
    const ret = findAllToArray(await dataSourceModel.find({
      trendId: req.params.trendId,
      username: req.user.name
    }).collation({locale: "en", strength: 2}));
    res.send({
      api: lastPathElement(req.url),
      method: "get",
      ret
    });
  } catch (ex) {
    logger.error(ex);
    res.status(400).send(JSON.stringify(ex));
  }
});

router.get("/similar/:trendId", async (req, res, next) => {
  try {
    const ret = findAllToArray(await dataSourceModel.find({trendId: {"$regex": req.params.trendId, "$options": "i"}}));
    res.send({
      api: secondToLastPathElement(req.url),
      method: "get",
      ret
    });
  } catch (ex) {
    logger.error(ex);
    res.status(400).send(JSON.stringify(ex));
  }
});

router.post("/script", async (req, res, next) => {
  try {
    const defaultScript = createDefaultScript(req.body.url, req.body.trendId, req.user.name);
    const ret = await runScript(defaultScript);
    res.send({
      api: lastPathElement(req.url),
      method: "post",
      ret
    });
  } catch (ex) {
    const err = `Error fetching: ${JSON.stringify(req.body)} because ${ex}`
    logger.error(err);
    res.status(400).send(err);
  }
});

router.put("/script", async (req, res, next) => {
  try {
    const query = {username: req.body.username, trendId: req.body.trendId, sourceDocument: req.body.sourceDocument};
    let data = req.body;
    delete data._id;
    const ret = await db.upsert(dataSourceModel, query, data);

    // const script = await dataSourceModel.findOne(query);
    // const ret = await runScript(script.toObject());
    // for (const graph of ret.graphQueries) {
    //   await db.upsertUniqueXValue(trendGraphModel, graph);
    // }
    // const userTrendGraphs = findAllToArray(await trendGraphModel.find({
    //   username: req.body.username,
    //   trendId: req.body.trendId
    // }));
    res.send({
      api: lastPathElement(req.url),
      method: "put",
      ret
    });
  } catch (ex) {
    const err = `Error putting: ${JSON.stringify(req.body)} because ${ex}`
    logger.error(err);
    res.status(400).send(err);
  }
});

router.patch("/script", async (req, res, next) => {
  try {
    const query = {username: req.user.name, trendId: req.body.trendId, name: req.body.name};
    const script = await dataSourceModel.findOne(query);
    const ret = await runScript(script.toObject());
    res.send({
      api: lastPathElement(req.url),
      method: "patch",
      ret
    });
  } catch (ex) {
    const err = `Error patching: ${JSON.stringify(req.body)} because ${ex}`
    logger.error(err);
    res.status(400).send(err);
  }
});

router.delete("/script", async (req, res, next) => {
  try {
    const query = {username: req.user.name, trendId: req.body.trendId, name: req.body.name};
    await dataSourceModel.deleteOne(query);

    let retO = await dataSourceModel.find({
      trendId: req.body.trendId,
      username: req.user.name
    }).collation({locale: "en", strength: 2});
    let ret = [];
    for (let elem of retO) {
      ret.push(elem.toObject());
    }

    res.send({
      api: lastPathElement(req.url),
      method: "delete",
      ret
    });
  } catch (ex) {
    const err = `Error patching: ${JSON.stringify(req.body)} because ${ex}`
    logger.error(err);
    res.status(400).send(err);
  }
});


module.exports = router;
