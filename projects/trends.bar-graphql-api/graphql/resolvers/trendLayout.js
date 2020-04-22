export default {
  Query: {
    trendLayout: (_, args, {dataSources}) => dataSources.trendLayouts.findOne(args),
  },

  Mutation: {
    async upsertTrendLayout(parent, {trendLayout}, {dataSources}, context) {
      return await dataSources.trendLayouts.upsert({
        trendId: trendLayout.trendId,
        username: trendLayout.username
      }, trendLayout);
    },
  }

};
