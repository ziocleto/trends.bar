import {ApolloError} from "apollo-server-errors";

export default {
  Query: {
    trends: (_, _2, {dataSources}) => dataSources.trends.get(),
    trend: (_, args, {dataSources}) => dataSources.trends.find(args),
    trend_similar: (_, args, {dataSources}) => dataSources.trends.findSimilar(args),
  },

  User: {
    trends: (user, args, {dataSources}) => dataSources.trends.find({username: user.name}),
    trend: (user, {trendId}, {dataSources}) => dataSources.trends.findOne({username: user.name, trendId: trendId})
  },

  Mutation: {
    async createTrend(parent, args, {dataSources}) {
      const query = {trendId: args.trendId, username: args.username};
      const ret = await dataSources.trends.save(query);
      if ( !ret ) {
        throw new ApolloError("Trend already exists");
      }
      return ret;
    },
    async removeTrend(parent, args, {dataSources}) {
      const query = {trendId: args.trendId, username: args.username};
      const retQuery = {username: args.username};
      return await dataSources.trends.removeWithFinalAllReturn(query, retQuery);
    },
  },

};
