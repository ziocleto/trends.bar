export default {
  Query: {
    trendLayout: (_, args, {dataSources}) => dataSources.trendLayouts.findOne(args),
  },
};
