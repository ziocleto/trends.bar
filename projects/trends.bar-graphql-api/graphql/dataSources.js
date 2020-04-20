import {trendGraphDataSource} from "./datasources/trendGraph";
import {MongoDataSourceExtended} from "./datasources/common";

import {trendGraphModel} from "../models/trendGraph";
import {trendModel} from "../models/trend";
import {trendLayoutModel} from "../models/trendLayout";
import {dataSourceModel} from "../models/dataSource";

const usersModel = require("eh_auth_and_auth/models/user");

export default () => ({
    trends: new MongoDataSourceExtended(trendModel),
    users: new MongoDataSourceExtended(usersModel),
    trendGraphs: new trendGraphDataSource(trendGraphModel),
    trendLayouts: new MongoDataSourceExtended(trendLayoutModel),
    dataSources: new MongoDataSourceExtended(dataSourceModel)
});
