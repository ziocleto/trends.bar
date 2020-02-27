import {GraphQLObjectType} from "graphql";

const express = require('express');
const {ApolloServer, gql} = require('apollo-server-express');
const crawlerRoute = require("./routes/crawlerRoute");
import { MongoDataSource } from 'apollo-datasource-mongodb'
const db = require("./db");
const trendModel = require("./models/trend-model");
const mongoose = require('mongoose');
import BigInt from "apollo-type-bigint";

const Long = new GraphQLObjectType({
  name: 'Long',
  fields: {
    numberField: {
      type: BigInt,
      // this would throw an error with the GraphQLInt
      resolve: () => Number.MAX_SAFE_INTEGER
    }
  }
})

const typeDefs = gql`
    scalar BigInt
    
    type Dataset {
        trendId: String!
        source: String
        sourceDocument: String
        sourceName: String!
    }

    type GraphLayout {
        label: String
        subLabel: String
        type: String!
    }
    
    type Trend {
        _id: ID!
        datasetId: Dataset!
        graphId: GraphLayout!
        values: [ [BigInt] ]
    }

    type Query {
        hello: String
        trend(trendId: ID!): Trend
    }

`;

const resolvers = {
  Query: {
    hello: () => 'Hello world!',
    trend: (_, {trendId}, {dataSources}) => dataSources.trends.getTrendTopic(trendId)
  },
};

db.initDB();

class Trends extends MongoDataSource {
    async getTrendTopic(topicId) {
        const pop = trendModel.findOne({ _id: mongoose.Types.ObjectId(topicId)} ).populate('datasetId').populate('graphId');
        const res = await pop.exec();
        return res.toObject();
    }
}

const server = new ApolloServer(
  {
    typeDefs,
    resolvers,
    dataSources: () => ({
        trends: new Trends(trendModel)
    })
  }
);

const app = express();

server.applyMiddleware({app});

app.use("/crawler", crawlerRoute);

app.listen({port: 4500}, () =>
  console.log('Now browse to http://localhost:4500' + server.graphqlPath)
);

