import {app, httpServer} from "./httpserver";
const {ApolloServer} = require('apollo-server-express');
import typeDefs from './graphql/typeDefs';
import resolvers from './graphql/resolvers';
import dataSources from "./graphql/dataSources";
import * as authController from "eh_auth_and_auth/controllers/authController";

const logger = require('eh_logger');

const schema = {
  typeDefs,
  resolvers,
  dataSources,
  context: async ({req, connection}) => {
    if (connection) {
      return connection.context; // Subscription connection
    } else {
      try {
        const user = await authController.getUserFromRequest(req);
        return {user: user};
      } catch (ex) {
        logger.error("Reading of signed cookies failed because: ", ex);
        return {
          user: null
        };
      }
    }
  }
};

export const apolloServerInstance = new ApolloServer(schema);

export const initApollo = () => {
  apolloServerInstance.applyMiddleware({app});
  apolloServerInstance.installSubscriptionHandlers(httpServer);
}
