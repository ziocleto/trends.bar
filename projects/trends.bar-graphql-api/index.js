import {MongoDataSource} from 'apollo-datasource-mongodb'
import {crawlingScriptModel, trendGraphsModel, trendLayoutModel, trendsModel} from "./models/models";
import {PubSub} from "graphql-subscriptions";
import moment from "moment";
import {Cruncher} from "./assistants/cruncher-assistant";
import * as authController from "./modules/auth/controllers/authController";
import {firstDerivativeOf, firstDerivativePercOf} from "./assistants/graph-assistant";

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

    type DateFloat {
        x: BigInt
        y: Float
    }

    input DateIntInput {
        x: BigInt
        y: BigInt
    }

    type TrendGridLayout {
        i: String
        x: Int
        y: Int
        w: Int
        h: Int
        moved: Boolean
        static: Boolean
    }

    input TrendGridLayoutInput {
        i: String
        x: Int
        y: Int
        w: Int
        h: Int
        moved: Boolean
        static: Boolean
    }

    input TrendLayoutInput {
        name: String
        trendId: String
        username: String
        granularity: Int
        cols: Int
        width: Int
        gridLayout: [TrendGridLayoutInput!]
    }

    type TrendLayout {
        _id: ID!
        name: String
        trendId: String
        username: String
        granularity: Int
        cols: Int
        width: Int
        gridLayout: [TrendGridLayout!]
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
        valuesDx: [ DateInt ]
        valuesDx2: [ DateInt ]
        valuesDxPerc: [ DateFloat ]
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
        filename: String!
        text: String
    }

    type GraphQuery {
        trendId: String!
        username: String!
        title: String
        label: String
        subLabel: String
        type: String
        dataSequence: String
        values: [DateInt]
    }

    input GraphQueryInput {
        trendId: String!
        username: String!
        title: String
        label: String
        subLabel: String
        type: String
        dataSequence: String
        values: [DateIntInput]
    }

    type CrawlingOutput {
        crawledText: String
        traces: String
        graphQueries: [GraphQuery]
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
        dataSequence: String
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
        trendGraph(username:String!,trendId:String!,label:String!,title:String!): TrendGraph
        trendGraphs(username:String,trendId:String,label:String,title:String): [TrendGraph]
        trend(trendId: String!): [Trend]
        trend_similar(trendId: String!): [Trend]
        script(scriptName: String!, trendId: String!, username:String!): ScriptOutput
        scripts(trendId: String!, username:String!): [ScriptOutput]
        trendLayouts(trendId: String!, username:String!): [TrendLayout]
        trendLayout(layoutName: String!, trendId: String!, username:String!): TrendLayout
    }

    type Mutation {
        createTrend(trendId: String!, username: String!): Trend
        deleteTrendGraphs(trendId: String!, username: String!): String
        upsertTrendGraph(graphQueries: [GraphQueryInput]): String
        upsertTrendLayout(trendLayout: TrendLayoutInput): TrendLayout
        crawlTrendGraph(scriptName: String!, script: CrawlingScript!): CrawlingOutput
        scriptRemove(scriptName: String!, trendId: String!, username:String!): [ScriptOutput]
        scriptRename(scriptName: String!, trendId: String!, username:String!, newName: String!): ScriptOutput
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
    trendGraph: (_, args, {dataSources}) => dataSources.trendGraphs.findOne(args),
    trendGraphs: (_, args, {dataSources}) => dataSources.trendGraphs.find(args),
    trend_similar: (_, args, {dataSources}) => dataSources.trends.findSimilar(args),
    users: (_, _2, {dataSources}) => dataSources.users.get(),
    user: (_, {name}, {dataSources}) => dataSources.users.findOne({name: name}),
    script: (_, {scriptName, trendId, username}, {dataSources}) => dataSources.scripts.findOneStringify({
      scriptName,
      trendId,
      username
    }),
    scripts: (_, {trendId, username}, {dataSources}) => dataSources.scripts.findManyStringify({trendId, username}),

    trendLayouts: (_, _2, {dataSources}) => dataSources.trendLayouts.find(args),
    trendLayout: (_, args, {dataSources}) => dataSources.trendLayouts.findOne(args),
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
      const newTrend = await dataSources.trends.upsertAndGet({trendId: args.trendId, username: args.username});
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
      await dataSources.scripts.upsert({
        scriptName: args.scriptName,
        username: args.script.username,
        trendId: args.script.trendId
      }, args.script);
      return await dataSources.trendGraphs.crawlTrendGraph(args.script);
    },

    async upsertTrendGraph(parent, args, {dataSources}, context) {
      return await dataSources.trendGraphs.upsertGraphs(args);
    },

    async upsertTrendLayout(parent, {trendLayout}, {dataSources}, context) {
      return await dataSources.trendLayouts.upsertAndGet( {name: trendLayout.name, trendId: trendLayout.trendId, username: trendLayout.username}, trendLayout);
    },

    scriptRemove: (_, {scriptName, trendId, username}, {dataSources}) => dataSources.scripts.removeAndRelist({
      scriptName,
      trendId,
      username
    }),
    scriptRename: (_, {scriptName, trendId, username, newName}, {dataSources}) => dataSources.scripts.updateOneStringify({
      scriptName,
      trendId,
      username
    }, {scriptName: newName})

    // async saveScript(parent, args, {dataSources}) {
    //   await dataSources.scripts.upsert({ username: args.script.username, trendId: args.script.trendId}, args.script);
    //   return JSON.stringify(args.script);
    // },

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

  async remove(query) {
    await this.model.remove(query).collation({locale: "en", strength: 2});
    return "OK";
    // The result of remove is a find of the remaining documents, this might change
    return this.model.find({});
  }

  async removeAndRelist(query) {
    const numDocs = await this.model.countDocuments();
    await this.model.remove(query).collation({locale: "en", strength: 2});
    // The result of remove is a find of the remaining documents
    const numDocsAfterDeletion = await this.model.countDocuments();
    if (numDocs === numDocsAfterDeletion) {
      return null;
    }
    const ret = await this.model.find({});
    let res = [];
    for (const script of ret) {
      let sn = script.toObject().scriptName;
      res.push({
        filename: sn,
        text: this.cleanScriptString(script)
      });
    }
    return res;
  }

  async findSimilar(query) {
    return await this.model.find({trendId: {"$regex": query.trendId, "$options": "i"}});
  }

  async findOne(query) {
    const ret = await this.model.findOne(query).collation({locale: "en", strength: 2});
    return ret;
  }

  cleanScriptStringNoObj(ret2) {
    ret2["_id"] = null;
    delete ret2["_id"];
    delete ret2["__v"];
    delete ret2["username"];
    delete ret2["trendId"];
    delete ret2["scriptName"];
    return JSON.stringify(ret2, null, 2);
  }

  cleanScriptString(ret) {
    return this.cleanScriptStringNoObj(ret.toObject());
  }

  async findOneStringify(query) {
    const ret = await this.model.findOne(query).collation({locale: "en", strength: 2});
    console.log(ret);
    return ret ? {
      filename: ret.toObject().scriptName,
      text: this.cleanScriptString(ret)
    } : null;
  }

  async findManyStringify(query) {
    const ret = await this.model.find(query).collation({locale: "en", strength: 2});
    let res = [];
    for (const script of ret) {
      let sn = script.toObject().scriptName;
      res.push({
        filename: sn,
        text: this.cleanScriptString(script)
      });
    }
    return res;
  }

  async updateOne(query, data) {
    const doc = await this.model.findOneAndUpdate(query, data);
    const ret = doc.toObject();
    return ret;
  }

  async updateOneStringify(query, data) {
    // WARNING: findOneAndUpdate returns the doc _before_ the update, so basically it returns the findOne part :/ Lame
    const doc = await this.model.findOneAndUpdate(query, data);
    if (!doc) {
      return null;
    }
    const updated = await this.model.findById(doc._id);
    const ret = updated.toObject();
    return {
      filename: ret.scriptName,
      text: this.cleanScriptStringNoObj(ret)
    };
  }

  async upsert(query, data) {
    return await db.upsert(this.model, data, query);
  }

  async upsertAndGet(query, data) {
    await db.upsert(this.model, data, query);
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
      return {crawledText: text, traces: traces, graphQueries: graphQueries, dataset: datasetElem};
    } catch (e) {
      return {error: e}
    }
  }

  async deleteTrendGraphs(trendId, username) {
    const trend = await trendsModel.findOne({trendId, username});
    if (!trend) return null;

    await trendGraphsModel.deleteMany({_id: {'$in': trend.trendGraphs}});
    await trendsModel.updateOne({_id: trend._id}, {$set: {trendGraphs: []}});

    return trend._id;
  }

  async upsertUniqueXValue(query) {
    let queryOnly = query;
    const values = query.values;
    delete queryOnly.values;

    const data = {
      ...query,
      $push: {
        values: {
          $each: values,
          $sort: {x: 1}
        }
      }
    };
    const ret = await db.upsert(this.model, data, queryOnly);

    let newValues = [];
    let newValuesDx = [];
    let newValuesDx2 = [];
    let newValuesDxPerc = [];
    for (let index = 0; index < ret.values.length - 1; index++) {
      if (ret.values[index].x !== ret.values[index + 1].x) {
        newValues.push(ret.values[index]);
      }
    }
    newValues.push(ret.values[ret.values.length - 1]);

    if (query.dataSequence === "Cumulative") {
      newValuesDx = firstDerivativeOf(newValues);
      newValuesDx2 = firstDerivativeOf(newValuesDx);
      newValuesDxPerc = firstDerivativePercOf(newValuesDx);
    }

    await this.model.updateOne(query, {
      $set: {
        values: newValues,
        valuesDx: newValuesDx,
        valuesDxPerc: newValuesDxPerc,
        valuesDx2: newValuesDx2,
      }
    });
  }

  async upsertGraphs(query) {
    for (const graph of query.graphQueries) {
      await this.upsertUniqueXValue(graph);
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
      trendLayouts: new MongoDataSourceExtended(trendLayoutModel)
    }),
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
