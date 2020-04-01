import {TrendGraphDataSource} from "./trendGraph";
import {MongoDataSourceExtended} from "./common";
import {crawlingScriptDataSource} from "./crawlingScript";

import {trendGraphsModel} from "../../models/trendGraph";
import {trendsModel} from "../../models/trend";
import {crawlingScriptModel} from "../../models/crawlingScript";
import {trendLayoutModel} from "../../models/trendLayout";

const usersModel = require("eh_auth_and_auth/models/user");

export const gqlDataSources = () => ({
    trends: new MongoDataSourceExtended(trendsModel),
    users: new MongoDataSourceExtended(usersModel),
    scripts: new crawlingScriptDataSource(crawlingScriptModel),
    trendGraphs: new TrendGraphDataSource(trendGraphsModel),
    trendLayouts: new MongoDataSourceExtended(trendLayoutModel)
});
