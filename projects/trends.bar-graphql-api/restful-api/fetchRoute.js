'use strict';

import {Cruncher} from "../assistants/cruncher-assistant";
import * as graphAssistant from "../assistants/graph-assistant";
import {crawlingScriptModel} from "../models/crawlingScript";
import {trendGraphModel} from "../models/trendGraph";

const express = require("express");
const logger = require("eh_logger");
const fetch = require('node-fetch');
const csv = require('csvtojson');
const db = require('eh_db');

const router = express.Router();

const getDefaultLabelTransformOf = (group) => {
  if (group.toLowerCase().includes("country")) {
    return "Country";
  }
  return "None";
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

const scriptInjectFromCSV = (sj, cvsGroups) => {
  sj["groups"] = [];
  const groups = cvsGroups;
  for (const group of groups["group"]) {
    for (const elem of groups["y"]) {
      sj["groups"].push({
        yValueGroup: group,
        labelTransform: getDefaultLabelTransformOf(group),
        key: elem,
        x: groups["x"][0],
        y: elem
      });
    }
  }
  return sj;
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
  let keys = {};
  const valueKeys = Object.keys(resjson[0]);
  for (const vk of valueKeys) {
    if (checkIfNumberSequence(resjson, vk)) {
      keys["y"] ? keys["y"].push(vk) : keys['y'] = [vk];
    } else if (checkIfDateSequence(resjson, vk)) {
      keys["x"] ? keys["x"].push(vk) : keys['x'] = [vk];
    } else {
      keys["group"] ? keys["group"].push(vk) : keys['group'] = [vk];
    }
  }
  return keys;
};

const createDefaultScript = ( url, trendId, username) => {
  return {
    name: url.substring(url.lastIndexOf('/') + 1),
    sourceDocument:url,
    trendId,
    username,
  };

};

const runScript = async (script) => {
  const resjson = await fetchCSV(script.sourceDocument);
  const keys = getCSVKeys(resjson);
  script = scriptInjectFromCSV(script, keys);
  const cruncher = new Cruncher(script.trendId, script.username, resjson, graphAssistant.xyDateInt(), "embedded");
  const graphQueries = await cruncher.crunch(script);
  return {script, crawledText: resjson, graphQueries, error: null};
};

router.post("/csvgraphkeys", async (req, res, next) => {
  try {
    const defaultScript = createDefaultScript(req.body.url, req.body.trendId, req.user.name);
    const ret = await runScript(defaultScript);
    res.send(ret);
  } catch (ex) {
    const err = `Error fetching: ${JSON.stringify(req.body)} because ${ex}`
    logger.error(err);
    res.status(400).send(err);
  }
});

const upsertUniqueXValue = async (model, query) => {
  let queryOnly = query;
  const values = query.values;
  delete queryOnly.values;

  const data = {
    ...query,
    $push: {
      values: {
        $each: values,
        $sort: {x: 1}
      }
    }
  };
  const ret = await db.upsert(model, queryOnly, data);

  let newValues = [];
  for (let index = 0; index < ret.values.length - 1; index++) {
    if (ret.values[index].x !== ret.values[index + 1].x) {
      newValues.push(ret.values[index]);
    }
  }
  newValues.push(ret.values[ret.values.length - 1]);

  await model.updateOne(query, {
    $set: {
      values: newValues,
    }
  });
};

router.put("/script", async (req, res, next) => {
  try {
    const query = {username: req.body.username, trendId: req.body.trendId, name: req.body.name};
    await db.upsert(crawlingScriptModel, query, req.body);
    const script = await crawlingScriptModel.findOne(query);
    const ret = await runScript(script.toObject());
    for (const graph of ret.graphQueries) {
      await upsertUniqueXValue( trendGraphModel, graph);
    }
    res.send(req.body);
  } catch (ex) {
    const err = `Error scripting: ${JSON.stringify(req.body)} because ${ex}`
    logger.error(err);
    res.status(400).send(err);
  }
});

module.exports = router;
