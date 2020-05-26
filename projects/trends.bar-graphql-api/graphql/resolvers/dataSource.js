export default {
  Query: {
    dataSources: (_, _2, {dataSources}) => dataSources.dataSources.get(),
    dataSource: (_, {name, username, trendId}, {dataSources}) => dataSources.dataSources.findOne({name, username, trendId}),
  },

  TrendLayout: {
    datasets: (trendLayout, args, {dataSources}) => dataSources.dataSources.find({
      username: trendLayout.username,
      trendId: trendLayout.trendId
    }),
  },
};
