import {MongoDataSource} from 'apollo-datasource-mongodb'
import {crawlingScriptModel, trendGraphsModel, trendsModel} from "./models/models";
import {PubSub} from "graphql-subscriptions";
import moment from "moment";
import {crawlTrendId, Cruncher} from "./assistants/cruncher-assistant";
import * as authController from "./modules/auth/controllers/authController";

const graphAssistant = require("./assistants/graph-assistant");
const datasetAssistant = require("./assistants/dataset-assistant");
const cookieParser = require("cookie-parser");
const globalConfig = require("eh_config");
const usersModel = require("./modules/auth/models/user");

const usersRoute = require("./modules/auth/routes/usersRoute");
const tokenRoute = require("./modules/auth/routes/tokenRoute");
const logger = require('eh_logger');
const fetch = require('node-fetch');

const http = require('http');

const pubsub = new PubSub();

const express = require('express');
const bodyParser = require("body-parser");

const {ApolloServer, gql} = require('apollo-server-express');

const db = require("./db");

const TREND_MUTATED = 'trendMutated';
const TREND_GRAPH_MUTATED = 'trendGraphMutated';

const typeDefs = gql`
    scalar BigInt

    type Dataset {
        trendId: ID!
        source: String
        sourceDocument: String
        sourceName: String
    }

    type DateInt {
        x: BigInt
        y: BigInt
    }

    input DateIntInput {
        x: BigInt
        y: BigInt
    }

    type TrendGraph {
        _id: ID!
        trendId: String!
        username: String!
        title: String
        label: String
        subLabel: String
        type: String!
        values: [ DateInt ]!
    }

    type User {
        _id: ID!
        name: String!
        email: String!
        trends: [Trend]
        trend(trendId: String!): Trend
    }

    type Trend {
        _id: ID!
        trendId: String!
        username: String
        user: User
        aliases: [ String! ]
        trendGraphs: [TrendGraph]
    }

    type ScriptOutput {
        text: String
    }

    type GraphQuery {
        trendId: String!
        username: String!
        title: String
        label: String
        subLabel: String
        type: String
    }

    type GraphValueQuery {
        value: DateInt!
        query: GraphQuery!
    }

    input GraphQueryInput {
        trendId: String!
        username: String!
        title: String
        label: String
        subLabel: String
        type: String
    }

    input GraphValueQueryInput {
        value: DateIntInput!
        query: GraphQueryInput!
    }

    input GraphQueries {
        graphQueries: [GraphValueQueryInput]
    }

    type CrawlingOutput {
        crawledText: String
        traces: String
        graphQueries: [GraphValueQuery]
        error: String
        dataset: Dataset
    }

    input CrawlingRegexp {
        body: String!
        flags: String
        resolver: String
    }

    input CrawlingCSV {
        label: String
        x: String
        y: String
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
        csv: CrawlingCSV
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
        trendId: String!
        username: String!
        source: String
        sourceName: String
        sourceDocument: String
        urlParser: String
        graphType: [String]
        timestamp: String
        timestampFormat: String
        version: String!
        functions: [CrawlingFunctions]
    }

    type Query {
        trends: [Trend]
        users: [User]
        user(name: String!): User
        trendGraph(id: ID!): TrendGraph
        trend(trendId: String!): [Trend]
        trend_similar(trendId: String!): [Trend]
        script(trendId: String!, username:String!): ScriptOutput
    }

    type Mutation {
        createTrend(trendId: String!, username: String!): Trend
        deleteTrendGraphs(trendId: String!, username: String!): String
        upsertTrendGraph(graphQueries: GraphQueries!): String
        crawlTrendGraph(script: CrawlingScript!): CrawlingOutput
        saveScript(script: CrawlingScript!): String
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
    trends: (_, _2, {dataSources}) => dataSources.trends.get(),
    trend: (_, args, {dataSources}) => dataSources.trends.find(args),
    trend_similar: (_, args, {dataSources}) => dataSources.trends.findSimilar(args),
    users: (_, _2, {dataSources}) => dataSources.users.get(),
    user: (_, {name}, {dataSources}) => dataSources.users.findOne({name: name}),
    script: (_, {trendId, username}, {dataSources}) => dataSources.scripts.findOneStringify({trendId, username})
  },

  User: {
    trends: (user, args, {dataSources}) => dataSources.trends.find({username: user.name}),
    trend: (user, {trendId}, {dataSources}) => dataSources.trends.findOne({username: user.name, trendId: trendId})
  },

  Trend: {
    // trendGraphs: (trend, _, {dataSources}) => dataSources.trends.getTrendGraph(trend.trendGraphs),
    user: (trend, _, {dataSources}) => dataSources.users.findOne({name: trend.username}),
    trendGraphs: (trend, _, {dataSources}) => dataSources.trendGraphs.find({
      trendId: trend.trendId,
      username: trend.username
    })
  },

  Mutation: {
    async createTrend(parent, args, {dataSources}) {
      const newTrend = await dataSources.trends.upsertAndGet( { trendId: args.trendId, username: args.username });
      await pubsub.publish(TREND_MUTATED, {
        trendMutated: {
          mutation: 'CREATED',
          node: newTrend
        }
      });
      return newTrend;
    },

    async deleteTrendGraphs(parent, args, {dataSources}) {
      const res = await dataSources.trendGraphs.deleteTrendGraphs(args.trendId, args.username);
      await pubsub.publish(TREND_MUTATED, {
        trendMutated: {
          mutation: 'DELETED',
          node: args.trendId
        }
      });
      return res;
    },

    async crawlTrendGraph(parent, args, {dataSources}, context) {
      return await dataSources.trendGraphs.crawlTrendGraph(args.script);
    },

    async upsertTrendGraph(parent, args, {dataSources}, context) {
      return await dataSources.trendGraphs.upsertGraphs(args);
    },

    async saveScript(parent, args, {dataSources}) {
      await dataSources.scripts.upsert({ username: args.script.username, trendId: args.script.trendId}, args.script);
      return JSON.stringify(args.script);
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

class MongoDataSourceExtended extends MongoDataSource {

  async get() {
    return await this.model.find({}).collation({locale: "en", strength: 2});
  }

  async find(query) {
    return await this.model.find(query).collation({locale: "en", strength: 2});
  }

  async findSimilar(query) {
    return await this.model.find( { trendId: { "$regex": query.trendId, "$options": "i" } } );
  }

  async findOne(query) {
    const ret = await this.model.findOne(query).collation({locale: "en", strength: 2});
    return ret;
  }

  cleanScriptString (ret) {
    let ret2 = ret.toObject();
    ret2["_id"] = null;
    delete ret2["_id"];
    delete ret2["__v"];
    delete ret2["username"];
    delete ret2["trendId"];
    return JSON.stringify(ret2, null, 2);
  }

  async findOneStringify(query) {
    const ret = await this.model.findOne(query).collation({locale: "en", strength: 2});
    return { text : !ret ? "" : this.cleanScriptString(ret) };
  }

  async upsert(query, data) {
    return await db.upsert(this.model, data, query);
  }

  async upsertAndGet(query, data) {
    await db.upsert(this.model, query, data);
    const ret = await this.model.findOne(query);
    return ret;
  }

}

class TrendGraphDataSource extends MongoDataSourceExtended {

  async crawlTrendGraph(script) {
    try {
      const trendId = script.trendId;
      const username = script.username;
      const timestamp = script.timestamp !== "embedded" ? moment(script.timestamp, script.timestampFormat) : script.timestamp;

      const response = await fetch(script.sourceDocument);
      const text = await response.text();
      //const text = await crawlTrendId(timestamp, script.timestamp);

      const datasetElem = await datasetAssistant.acquire(script.source, script.sourceName, script.sourceDocument);
      const cruncher = new Cruncher(trendId, username, text, graphAssistant.xyDateInt(), timestamp);

      const {traces, graphQueries} = await cruncher.crunch(script);
      return { crawledText: text, traces: traces, graphQueries: graphQueries, dataset: datasetElem };
    } catch (e) {
      return { error: e }
    }
  }

  async deleteTrendGraphs(trendId, username) {
    const trend = await trendsModel.findOne({trendId, username});
    if (!trend) return null;

    await trendGraphsModel.deleteMany({_id: {'$in': trend.trendGraphs}});
    await trendsModel.updateOne({_id: trend._id}, {$set: {trendGraphs: []}});

    return trend._id;
  }

  async upsertUniqueXValue(value, query) {
    const data = {
      ...query,
      $push: {
        values: {
          $each: [value],
          $sort: {x: 1}
        }
      }
    };
    const ret = await db.upsert(this.model, data, query);

    let setValues = [];
    for (let index = 0; index < ret.values.length - 1; index++) {
      if (ret.values[index].x !== ret.values[index + 1].x) {
        setValues.push(ret.values[index]);
      }
    }
    setValues.push(ret.values[ret.values.length - 1]);

    return await this.model.updateOne(query, {$set: {values: setValues}});
  }

  async upsertGraphs(query) {
    for ( const graph of query.graphQueries.graphQueries ) {
      await this.upsertUniqueXValue(graph.value, graph.query);
    }
    return "OK";
  }

}

const PORT = 4500;
const app = express();

const server = new ApolloServer(
  {
    typeDefs,
    resolvers,
    dataSources: () => ({
      trends: new MongoDataSourceExtended(trendsModel),
      users: new MongoDataSourceExtended(usersModel),
      scripts: new MongoDataSourceExtended(crawlingScriptModel),
      trendGraphs: new TrendGraphDataSource(trendGraphsModel),
    }),
    context: async ({req, connection}) => {
      if (connection) {
        return connection.context; // Subscription connection
      } else {
        try {
          const user = await authController.getUserFromRequest(req);
          return { user: user };
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

authController.initializeAuthentication();

app.use(bodyParser.raw({limit: "500mb", type: 'application/octet-stream'}));
app.use(bodyParser.text({limit: "500mb"}));
app.use(bodyParser.json({limit: "100mb"}));
app.use(bodyParser.urlencoded({limit: "100mb", extended: true}));
app.use(cookieParser(globalConfig.mJWTSecret));

server.applyMiddleware({app});
const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

app.use("/", tokenRoute);
app.use("/user", usersRoute);

app.use(authController.authenticate);

httpServer.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`)
  console.log(`🚀 Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`)
});
