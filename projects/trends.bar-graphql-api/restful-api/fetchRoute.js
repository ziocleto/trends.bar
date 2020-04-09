'use strict';

import moment from "moment";
import {Cruncher} from "../assistants/cruncher-assistant";
import * as graphAssistant from "../assistants/graph-assistant";
import * as datasetAssistant from "../assistants/dataset-assistant";

const express = require("express");
const logger = require("eh_logger");
const fetch = require('node-fetch');
const csv = require('csvtojson');

const router = express.Router();

const getDefaultLabelTransformOf = (group) => {
  if ( group.toLowerCase().includes("country") ) {
    return "Country";
  }
  return "None";
};

const checkIfNumberSequence = (resjson, vk) => {
  for ( let index = 1; index < resjson.length; index++ ) {
    if ( isNaN(Number(resjson[index][vk])) ) return false;
  }
  return true;
};

const checkIfDateSequence = (resjson, vk) => {
  for ( let index = 1; index < resjson.length; index++ ) {
    if ( isNaN(Date.parse(resjson[index][vk])) ) return false;
  }
  return true;
};

const defaultScriptFromCSV = (url, cvsGroups) => {
  let sj = {};
  sj["sourceDocument"] = url;
  sj["groups"] = [];
  const groups = cvsGroups;
  for (const group of groups["group"]) {
    for (const elem of groups["y"]) {
      sj["groups"].push({
        label: group,
        labelTransform: getDefaultLabelTransformOf(group),
        key: elem,
        x: groups["x"][0],
        y: elem
      });
    }
  }
  return sj;
};

router.post("/csvgraphkeys", async (req, res, next) => {
  try {
    const url = req.body.url;
    const response = await fetch(url);
    if ( response.status < 200 || response.status > 299 ) {
      res.status( response.status ).send( `${url} ${response.statusText}`);
      return;
    }
    const text = await response.text();
    if ( !text ) {
      res.status(400).send("Response is empty");
      return;
    }

    const resjson = await csv().fromString(text);
    let keys = {};
    if ( resjson.length > 1 ) {
      const valueKeys = Object.keys(resjson[0]);
      for ( const vk of valueKeys ) {
        if ( checkIfNumberSequence(resjson, vk)  ) {
          keys["y"] ? keys["y"].push(vk) : keys['y'] = [vk];
        } else if ( checkIfDateSequence(resjson, vk ) ) {
          keys["x"] ? keys["x"].push(vk) : keys['x'] = [vk];
        } else {
          keys["group"] ? keys["group"].push(vk) : keys['group'] = [vk];
        }
      }
    }

    const trendId = req.body.trendId;
    const username = req.user.name;
    const script = defaultScriptFromCSV(url, keys);
    // const timestamp = script.timestamp !== "embedded" ? moment(script.timestamp, script.timestampFormat) : script.timestamp;
    //
    const datasetElem = null;// await datasetAssistant.acquire(script.source, script.sourceName, script.sourceDocument);
    const cruncher = new Cruncher(trendId, username, text, graphAssistant.xyDateInt(), "embedded");
    const {traces, graphQueries} = await cruncher.crunch(script);

    let groupsSet = new Set();
    let groupSetArray = [];
    script.groups.map(elem => groupsSet.add(elem.label));
    groupsSet.forEach(e => groupSetArray.push(e));

    let groupQuerySet = {};
    let groupQuerySetOfSet = {};

    for ( const group of groupSetArray ) {
      groupQuerySet[group] = [];
      groupQuerySetOfSet[group] = {};
      graphQueries.map( elem => {
        if ( elem.subLabel === group ) {
          groupQuerySet[group].push(elem);
          // groupQuerySetOfSet[group] = .push(elem);
          groupQuerySetOfSet[group][elem.label] ? groupQuerySetOfSet[group][elem.label].push(elem) : groupQuerySetOfSet[group][elem.label]=[elem];
        }
      });
    }

    const ret = {
      urlKey: url,
      script: script,
      crawledText: text,
      traces: traces,
      groupQuerySet: groupQuerySetOfSet,
      dataset: datasetElem
    };

    res.send( ret );
  } catch (ex) {
    const err = `Error fetching: ${JSON.stringify(req.body)} because ${ex}`
    logger.error(err);
    res.status(400).send(err);
  }
});


module.exports = router;
