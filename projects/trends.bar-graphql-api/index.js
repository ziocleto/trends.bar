const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const crawlerRoute = require("./routes/crawlerRoute");
const db = require("./db");

const typeDefs = gql`
  type Query {
    hello: String
  }
`;

const resolvers = {
  Query: {
    hello: () => 'Hello world!',
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

const app = express();

server.applyMiddleware({ app });

app.use("/crawler", crawlerRoute);

app.listen({ port: 4500 }, () =>
  console.log('Now browse to http://localhost:4500' + server.graphqlPath)
);

db.initDB();
