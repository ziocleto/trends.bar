import {app, httpServer} from "./httpserver";

const {ApolloServer} = require('apollo-server-express');

import {gqlSchema} from "./graphql/schemas/graphql_master_schema";
import {gqlResolvers} from "./graphql/resolvers/resolvers";
import {gqlDataSources} from "./graphql/datasources/datasources";
import * as authController from "eh_auth_and_auth/controllers/authController";

const logger = require('eh_logger');

export const apolloServerInstance = new ApolloServer(
  {
    typeDefs : gqlSchema,
    resolvers: gqlResolvers,
    dataSources: gqlDataSources,
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
  }
);

export const initApollo = () => {
  apolloServerInstance.applyMiddleware({app});
  apolloServerInstance.installSubscriptionHandlers(httpServer);
}
