
export default {
  Query: {
    script: (_, {scriptName, trendId, username}, {dataSources}) => dataSources.scripts.findOneStringify({
      scriptName,
      trendId,
      username
    }),
    scripts: (_, {trendId, username}, {dataSources}) => dataSources.scripts.findManyStringify({trendId, username}),
  },

  Mutation: {
    async crawlTrendGraph(parent, args, {dataSources}, context) {
      await dataSources.scripts.upsert({
        scriptName: args.scriptName,
        username: args.script.username,
        trendId: args.script.trendId
      }, args.script);
      return await dataSources.trendGraphs.crawlTrendGraph(args.script);
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
  }

};
