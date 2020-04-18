
export default {
  Query: {
    trendLayout: (_, args, {dataSources}) => dataSources.trendLayouts.findOne(args),
  },

  TrendLayout: {
    gridLayout: (trendLayout) => trendLayout.gridLayout,
    gridContent: (trendLayout) => trendLayout.gridContent,
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
