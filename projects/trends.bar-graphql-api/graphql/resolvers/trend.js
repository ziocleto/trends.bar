import {ApolloError} from "apollo-server-errors";

export default {
  Query: {
    trends: (_, _2, {dataSources}) => dataSources.trends.get(),
    trend: (_, args, {dataSources}) => dataSources.trends.findOne(args),
    trend_similar: (_, args, {dataSources}) => dataSources.trends.findSimilar(args),
  },

  User: {
    trends: (user, args, {dataSources}) => dataSources.trends.find({username: user.name}),
    trend: (user, {trendId}, {dataSources}) => dataSources.trends.findOne({username: user.name, trendId: trendId})
  },

  Mutation: {
    async createTrend(parent, args, {dataSources}) {
      const query = {trendId: args.trendId, username: args.username, draft: true};
      const ret = await dataSources.trends.save(query);
      if (!ret) {
        throw new ApolloError("Trend already exists");
      }
      return ret;
    },
    async upsertTrendDataSource(parent, args, {dataSources}) {
      const query = {username: args.username, trendId: args.trendId};
      const upret = await dataSources.trends.updateOne(query, {$push: {dataSources: args.dataSource}});
      if (!upret) {
        throw new ApolloError("Trend is seriously broken :/ Call Dado on +44 7779 9384856");
      }
      return upret._id; //await dataSources.trends.findOne(query);
    },
    async removeTrendDataSource(parent, args, {dataSources}) {
      const query = {username: args.username, trendId: args.trendId};
      const trend = await dataSources.trends.find(query);
      const elaborated = {
        ...trend,
        dataSources: trend.dataSources.filter(elem => elem.name !== args.dataSourceName)
      }
      const ret = await dataSources.trends.upsert(query, elaborated);
      if (!ret) {
        throw new ApolloError("Trend is seriously broken :/ Call Dado on +44 7779 9384856");
      }
      return ret;
    },

    async removeTrend(parent, args, {dataSources}) {
      const query = {trendId: args.trendId, username: args.username};
      const retQuery = {username: args.username};
      await dataSources.trendLayouts.remove(query);
      await dataSources.dataSources.remove(query);
      return await dataSources.trends.removeWithFinalAllReturn(query, retQuery);
    },
  },

};
