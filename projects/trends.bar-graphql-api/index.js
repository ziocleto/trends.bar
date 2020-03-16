import {GraphQLObjectType} from "graphql";
import {MongoDataSource} from 'apollo-datasource-mongodb'
import BigInt from "apollo-type-bigint";
import {trendGraphsModel, trendsModel} from "./models/models";
import {PubSub} from "graphql-subscriptions";
const http = require('http');

const pubsub = new PubSub();

const express = require('express');
const bodyParser = require("body-parser");

const {ApolloServer, gql} = require('apollo-server-express');
const crawlerRoute = require("./routes/crawlerRoute");

const db = require("./db");

// enum MutationType {
//   CREATED
//   UPDATED
//   DELETED
// }

const TREND_MUTATED = 'trendMutated';

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
        aliases: [ String! ]
        trendGraphs: [TrendGraph]
    }

    type Query {
        trendGraph(id: ID!): TrendGraph
        trend(trendId: String!): Trend
    }

    type Mutation {
        createTrend(trendId: String!): Trend
    }

    type Subscription {
        trendMutated: trendMutationPayload
    }

    type trendMutationPayload {
        mutation: String!
        node: Trend!
    }

`;

const resolvers = {
  Query: {
    trendGraph: (_, {id}, {dataSources}) => dataSources.trendGraphs.getTrendGraph(id),
    trend: (_, {trendId}, {dataSources}) => dataSources.trends.getTrend(trendId)
  },

  Mutation: {
    async createTrend(parent, args, {dataSources}) {
      const newTrend = await dataSources.trends.createTrend(args.trendId);
      pubsub.publish(TREND_MUTATED, {
        trendMutated: {
          mutation: 'CREATED',
          node: newTrend
        }
      });
      return newTrend;
    },
  },

  Subscription: {
    trendMutated: {
      subscribe: () => pubsub.asyncIterator([TREND_MUTATED])
    }
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

  async createTrend( trendId ) {
    return await db.upsert(this.model,{trendId} );
  }

}

const PORT = 4500;
const app = express();

const server = new ApolloServer(
  {
    typeDefs,
    resolvers,
    dataSources: () => ({
      trends: new TrendsDataSource(trendsModel),
      trendGraphs: new TrendsDataSource(trendGraphsModel),
    }),
    context: async ({ req, connection }) => {
      if (connection) {
        // check connection for metadata
        return connection.context;
      } else {
        // check from req
        const token = req.headers.authorization || "";
        return {token};
      }
    }
  }
);

server.applyMiddleware({app});
const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

app.use(bodyParser.raw({limit: "500mb", type: 'application/octet-stream'}));
app.use(bodyParser.text({limit: "500mb"}));
app.use(bodyParser.json({limit: "100mb"}));
app.use(bodyParser.urlencoded({limit: "100mb", extended: true}));

app.use("/crawler", crawlerRoute);

httpServer.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`)
  console.log(`🚀 Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`)
});
