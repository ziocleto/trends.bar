import {MongoDataSource} from 'apollo-datasource-mongodb'
import {trendGraphsModel, trendsModel} from "./models/models";
import {PubSub} from "graphql-subscriptions";
import moment from "moment";
import {crawlTrendId, Cruncher} from "./assistants/cruncher-assistant";
import * as authController from "./modules/auth/controllers/authController";
import {getUserFromTokenRaw} from "./modules/auth/controllers/authController";

const graphAssistant = require("./assistants/graph-assistant");
const datasetAssistant = require("./assistants/dataset-assistant");
const cookieParser = require("cookie-parser");
const globalConfig = require('./modules/auth/config_api');
const jsonWebToken = require('jsonwebtoken')
const sessionModel = require("./modules/auth/models/session");

const usersRoute = require("./modules/auth/routes/usersRoute");
const tokenRoute = require("./modules/auth/routes/tokenRoute");
const logger = require('./logger');

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
const TREND_GRAPH_MUTATED = 'trenGraphMutated';

// const Long = new GraphQLObjectType({
//   name: 'Long',
//   fields: {
//     numberField: {
//       type: BigInt,
//       // this would throw an error with the GraphQLInt
//       resolve: () => Number.MAX_SAFE_INTEGER
//     }
//   }
// })

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

    input CrawlingRegexp {
        body: String!
        flags: String
        resolver: String
    }

    input CrawlingDateRange {
        from: String!
        to: String!
    }

    input CrawlingPostTransform {
        transform: String
        source: String
        sourceIndex: Int
        valueIndex: Int
        dest: String
        algo: String
    }

    input CrawlingActions {
        regex: CrawlingRegexp
        startRegex: CrawlingRegexp
        endRegex: CrawlingRegexp
        validRange: CrawlingDateRange
        postTransform: CrawlingPostTransform
    }

    input CrawlingDatasets {
        title: String
        actions: [CrawlingActions]
    }

    input CrawlingFunctions {
        type: String
        key: String
        datasets: [CrawlingDatasets]
    }

    input CrawlingScript {
        trendId: String
        source: String
        sourceName: String
        graphType: [String]
        timestamp: String
        timestampFormat: String
        functions: [CrawlingFunctions]
    }

    type Mutation {
        createTrend(trendId: String!): Trend
        upsertTrendGraph(script: CrawlingScript!): TrendGraph
    }

    type Subscription {
        trendMutated: trendMutationPayload
        trendGraphMutated: trendMutationPayload
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
      await pubsub.publish(TREND_MUTATED, {
        trendMutated: {
          mutation: 'CREATED',
          node: newTrend
        }
      });
      return newTrend;
    },

    async upsertTrendGraph(parent, args, {dataSources}) {
      const ret = await dataSources.trendGraphs.upsertTrendGraph(args.script);
      console.log("Sending to pubsub: ", ret);
      await pubsub.publish(TREND_GRAPH_MUTATED, {
        trendGraphMutated: {
          mutation: 'UPDATED',
          node: ret
        }
      });
      return ret;
    },
  },

  Subscription: {
    trendMutated: {
      subscribe: () => pubsub.asyncIterator([TREND_MUTATED])
    },
    trendGraphMutated: {
      subscribe: () => pubsub.asyncIterator([TREND_GRAPH_MUTATED])
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
    const pop = trendsModel.findOne({trendId: trendId}).populate({
      path: 'trendGraphs',
      populate: {path: 'dataset graph'}
    });
    const res = await pop.exec();
    return res.toObject();
  }

  async createTrend(trendId) {
    return await db.upsert(this.model, {trendId});
  }

  async upsertTrendGraph(script) {
    const trendId = script.trendId;
    const timestamp = moment(script.timestamp, script.timestampFormat);
    const text = await crawlTrendId(timestamp, script.timestamp);

    const datasetElem = await datasetAssistant.acquire(script.source, script.sourceName);
    const cruncher = new Cruncher(trendId, text, datasetElem, graphAssistant.xyDateInt(), timestamp);

    await cruncher.crunch(script);

    return await this.getTrend(trendId);
  }

}

const PORT = 4500;
const app = express();

const getValidSessionById = async sessionId => {
  const currentDate = new Date();
  const currentEpoch = Math.floor(currentDate / 1000);
  const query = {
    $and: [
      // {_id: ObjectId(sessionId)},
      {ids: sessionId},
      // {issuedAt: {$lte: currentEpoch }},
      // {expiresAt: {$gte: currentEpoch}},
      {issuedAtDate: {$lte: currentDate}},
      {expiresAtDate: {$gte: currentDate}}
    ]
  };
  // console.log(query);
  // console.log(query["$and"]);
  // console.log(query["$and"]);
  let dbSession = await sessionModel.findOne(query);
  if (dbSession !== null) {
    dbSession = dbSession.toObject();
  }
  // console.log("CURRENT SESSION:",dbSession);
  return dbSession;
};

const server = new ApolloServer(
  {
    typeDefs,
    resolvers,
    dataSources: () => ({
      trends: new TrendsDataSource(trendsModel),
      trendGraphs: new TrendsDataSource(trendGraphsModel),
    }),
    context: async ({req, connection}) => {
      if (connection) {
        // check connection for metadata
        return connection.context;
      } else {
        try {
          const token = req.signedCookies ? req.signedCookies["eh_jwt"] : null;
          return {
            user: await getUserFromTokenRaw(token)
          };
        } catch (e) {
          logger.error("Reading of signed cookies failed because: ", e);
          return {
            user: null
          };
        }
      }
    }
  }
);

authController.InitializeAuthentication();

app.use(bodyParser.raw({limit: "500mb", type: 'application/octet-stream'}));
app.use(bodyParser.text({limit: "500mb"}));
app.use(bodyParser.json({limit: "100mb"}));
app.use(bodyParser.urlencoded({limit: "100mb", extended: true}));
app.use(cookieParser(globalConfig.mJWTSecret));

app.use("/crawler", crawlerRoute);

server.applyMiddleware({app});
const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

app.use("/", tokenRoute);

app.use(authController.authenticate);

app.use("/user", usersRoute);

httpServer.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`)
  console.log(`🚀 Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`)
});
