import dbi from "eh_db";

import * as authController from "eh_auth_and_auth/controllers/authController";
import {initApollo} from "./apolloServer";
import {app, initServer, runServer} from "./httpserver";

const usersRoute = require("eh_auth_and_auth/routes/usersRoute");
const tokenRoute = require("eh_auth_and_auth/routes/tokenRoute");

const init = () => {
  dbi.initDB().then();
  initServer();
  authController.initializeAuthentication();
  initApollo();
}

const use = () => {
  app.use("/", tokenRoute);
  app.use("/user", usersRoute);
  app.use(authController.authenticate);
}

init();
use();
runServer();
