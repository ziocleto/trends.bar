
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
      return await dataSources.trends.upsert(query, query);
    },
  },

};
