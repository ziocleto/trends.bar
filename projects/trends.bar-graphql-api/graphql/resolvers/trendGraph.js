import * as pubsub from "graphql-subscriptions";

const TREND_GRAPH_MUTATED = "trendGraphMutated";

export default {
  Query: {
    trendGraph: (_, args, {dataSources}) => dataSources.trendGraphs.findOne(args),
    trendGraphs: (_, args, {dataSources}) => dataSources.trendGraphs.find(args),
  },

  Trend: {
    trendGraphs: (trend, _, {dataSources}) => dataSources.trendGraphs.find({
      trendId: trend.trendId,
      username: trend.username
    })
  },

  Mutation: {
    async deleteTrendGraphs(parent, args, {dataSources}) {
      const res = await dataSources.trendGraphs.deleteTrendGraphs(args.trendId, args.username);
      await pubsub.publish(TREND_GRAPH_MUTATED, {
        trendMutated: {
          mutation: 'DELETED',
          node: args.trendId
        }
      });
      return res;
    },

    async upsertTrendGraph(parent, args, {dataSources}, context) {
      return await dataSources.trendGraphs.upsertGraphs(args);
    },

  },

  Subscription: {
    trendGraphMutated: {
      subscribe: () => pubsub.asyncIterator([TREND_GRAPH_MUTATED])
    }
  },

};
