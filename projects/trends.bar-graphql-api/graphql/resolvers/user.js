export default {
  Query: {
    users: (_, _2, {dataSources}) => dataSources.users.get(),
    user: (_, {name}, {dataSources}) => dataSources.users.findOne({name: name}),
  },

  Trend: {
    user: (trend, _, {dataSources}) => dataSources.users.findOne({name: trend.username}),
  }
};
