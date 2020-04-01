import {apolloServerInstance} from "./apolloServer";

const globalConfig = require("eh_config");
const http = require('http');
const express = require('express');
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const PORT = 4500;
export let app = null;
export let httpServer = null;

export const initServer = () => {
  app = express();
  httpServer = http.createServer(app);

  app.use(bodyParser.raw({limit: "500mb", type: 'application/octet-stream'}));
  app.use(bodyParser.text({limit: "500mb"}));
  app.use(bodyParser.json({limit: "100mb"}));
  app.use(bodyParser.urlencoded({limit: "100mb", extended: true}));
  app.use(cookieParser(globalConfig.mJWTSecret));
}

export const runServer = () => {
  httpServer.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}${apolloServerInstance.graphqlPath}`)
    console.log(`🚀 Subscriptions ready at ws://localhost:${PORT}${apolloServerInstance.subscriptionsPath}`)
  });
}
