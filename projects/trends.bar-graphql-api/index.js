import {GraphQLObjectType} from "graphql";

const express = require('express');
const {ApolloServer, gql} = require('apollo-server-express');
const crawlerRoute = require("./routes/crawlerRoute");
import {MongoDataSource} from 'apollo-datasource-mongodb'

const db = require("./db");
import BigInt from "apollo-type-bigint";
import {trendGraphsModel} from "./models/models";

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

    type TrendGraph {
        _id: ID!
        trendId: String!
        dataset: Dataset!
        graph: GraphLayout!
        values: [ [BigInt] ]
    }

    type Query {
        trendGraphs(trendId: String!): [TrendGraph]
    }

`;

const resolvers = {
  Query: {
    trendGraphs: (_, {trendId}, {dataSources}) => dataSources.trends.getTrendGraphs(trendId)
  },
};

db.initDB();

class Trends extends MongoDataSource {
  async getTrendGraphs(trendId) {
    const pop = trendGraphsModel.find({ trendId: trendId} ).populate('dataset').populate('graph');
    const res = await pop.exec();
    let resO = [];
    for await ( const r of res ) {
      resO.push( r.toObject() );
    }
    console.log(resO);
    return resO;
  }
}

const server = new ApolloServer(
  {
    typeDefs,
    resolvers,
    dataSources: () => ({
      trends: new Trends(trendGraphsModel)
    })
  }
);

const app = express();

server.applyMiddleware({app});

app.use("/crawler", crawlerRoute);

app.listen({port: 4500}, () =>
  console.log('Now browse to http://localhost:4500' + server.graphqlPath)
);
