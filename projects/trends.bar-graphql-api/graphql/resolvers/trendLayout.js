
export default {
  Query: {
    trendLayouts: (_, args, {dataSources}) => dataSources.trendLayouts.find(args),
    trendLayout: (_, args, {dataSources}) => dataSources.trendLayouts.findOne(args),
  },

  TrendLayout: {
    gridLayout: (trendLayout, _, {dataSources}) => trendLayout.gridLayout
  },

  Mutation: {
    async upsertTrendLayout(parent, {trendLayout}, {dataSources}, context) {
      return await dataSources.trendLayouts.upsert({
        name: trendLayout.name,
        trendId: trendLayout.trendId,
        username: trendLayout.username
      }, trendLayout);
    },
  }

};
