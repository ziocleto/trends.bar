import {trendGraphDataSource} from "./datasources/trendGraph";
import {MongoDataSourceExtended} from "./datasources/common";
import {crawlingScriptDataSource} from "./datasources/crawlingScript";

import {trendGraphModel} from "../models/trendGraph";
import {trendModel} from "../models/trend";
import {crawlingScriptModel} from "../models/crawlingScript";
import {trendLayoutModel} from "../models/trendLayout";

const usersModel = require("eh_auth_and_auth/models/user");

export default () => ({
    trends: new MongoDataSourceExtended(trendModel),
    users: new MongoDataSourceExtended(usersModel),
    scripts: new crawlingScriptDataSource(crawlingScriptModel),
    trendGraphs: new trendGraphDataSource(trendGraphModel),
    trendLayouts: new MongoDataSourceExtended(trendLayoutModel)
});
