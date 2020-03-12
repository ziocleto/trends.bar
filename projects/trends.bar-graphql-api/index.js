import {GraphQLObjectType} from "graphql";
import {MongoDataSource} from 'apollo-datasource-mongodb'
import BigInt from "apollo-type-bigint";
import {trendGraphsModel, trendsModel} from "./models/models";

const express = require('express');
const bodyParser = require("body-parser");

const {ApolloServer, gql} = require('apollo-server-express');
const crawlerRoute = require("./routes/crawlerRoute");

const db = require("./db");

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
        trendId: ID!
        source: String
        sourceDocument: String
        sourceName: String
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
        values: [ [BigInt!]! ]!
    }

    type Trend {
        _id: ID!
        trendId: String!
        aliases: [ String! ]!
        trendGraphs: [TrendGraph]
    }

    type Query {
        trendGraph(id: ID!): TrendGraph
        trend(trendId: String!): Trend
    }

`;

const resolvers = {
  Query: {
    trendGraph: (_, {id}, {dataSources}) => dataSources.trendGraphs.getTrendGraph(id),
    trend: (_, {trendId}, {dataSources}) => dataSources.trends.getTrend(trendId)
  },
};

db.initDB();

class TrendsDataSource extends MongoDataSource {
  async getTrendGraph(id) {
    const pop = trendGraphsModel.findById(id).populate('dataset').populate('graph');
    const res = await pop.exec();
    return res.toObject();
  }

  async getTrend(trendId) {
    const pop = trendsModel.findOne({trendId: trendId}).populate( {
      path: 'trendGraphs',
      populate: { path: 'dataset graph'}
    });
    const res = await pop.exec();
    return res.toObject();
  }
}

const server = new ApolloServer(
  {
    typeDefs,
    resolvers,
    dataSources: () => ({
      trends: new TrendsDataSource(trendsModel),
      trendGraphs: new TrendsDataSource(trendGraphsModel),
    })
  }
);

const app = express();

server.applyMiddleware({app});

app.use(bodyParser.raw({limit: "500mb", type: 'application/octet-stream'}));
app.use(bodyParser.text({limit: "500mb"}));
app.use(bodyParser.json({limit: "100mb"}));
app.use(bodyParser.urlencoded({limit: "100mb", extended: true}));

app.use("/crawler", crawlerRoute);

app.listen({port: 4500}, () =>
  console.log('Now browse to http://localhost:4500' + server.graphqlPath)
);
