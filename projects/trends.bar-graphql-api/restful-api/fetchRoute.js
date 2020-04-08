'use strict';

const express = require("express");
const logger = require("eh_logger");
const fetch = require('node-fetch');
const csv = require('csvtojson');

const router = express.Router();

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

router.post("/csvgraphkeys", async (req, res, next) => {
  try {
    const url = Object.keys(req.body)[0];
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
    res.send( keys );
  } catch (ex) {
    const err = `Error fetching: ${JSON.stringify(req.body)} because ${ex}`
    logger.error(err);
    res.status(400).send(err);
  }
});


module.exports = router;
