import * as pubsub from "graphql-subscriptions";

export const gqlResolvers = {
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

    trendLayouts: (_, args, {dataSources}) => dataSources.trendLayouts.find(args),
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

  TrendLayout: {
    gridLayout: (trendLayout, _, {dataSources}) => trendLayout.gridLayout
  },

  Mutation: {
    async createTrend(parent, args, {dataSources}) {
      const query = {trendId: args.trendId, username: args.username};
      const data = query;
      const newTrend = await dataSources.trends.upsert(query, data);
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
      return await dataSources.trendLayouts.upsert({
        name: trendLayout.name,
        trendId: trendLayout.trendId,
        username: trendLayout.username
      }, trendLayout);
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
