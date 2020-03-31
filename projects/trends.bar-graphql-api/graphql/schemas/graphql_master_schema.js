import {gql} from "apollo-server-express";

export const gqlSchema = gql`
    scalar BigInt

    type Dataset {
        trendId: ID!
        source: String
        sourceDocument: String
        sourceName: String
    }

    type DateInt {
        x: BigInt
        y: BigInt
    }

    type DateFloat {
        x: BigInt
        y: Float
    }

    input DateIntInput {
        x: BigInt
        y: BigInt
    }

    type TrendGridLayout {
        i: String
        x: Int
        y: Int
        w: Int
        h: Int
        moved: Boolean
        static: Boolean
    }

    input TrendGridLayoutInput {
        i: String
        x: Int
        y: Int
        w: Int
        h: Int
        moved: Boolean
        static: Boolean
    }

    input TrendLayoutInput {
        name: String
        trendId: String
        username: String
        granularity: Int
        cols: Int
        width: Int
        gridLayout: [TrendGridLayoutInput!]
    }

    type TrendLayout {
        _id: ID!
        name: String
        trendId: String
        username: String
        granularity: Int
        cols: Int
        width: Int
        gridLayout: [TrendGridLayout]
    }

    type TrendGraph {
        _id: ID!
        trendId: String!
        username: String!
        title: String
        label: String
        subLabel: String
        type: String!
        values: [ DateInt ]!
        valuesDx: [ DateInt ]
        valuesDx2: [ DateInt ]
        valuesDxPerc: [ DateFloat ]
    }

    type User {
        _id: ID!
        name: String!
        email: String!
        trends: [Trend]
        trend(trendId: String!): Trend
    }

    type Trend {
        _id: ID!
        trendId: String!
        username: String
        user: User
        aliases: [ String! ]
        trendGraphs: [TrendGraph]
    }

    type ScriptOutput {
        filename: String!
        text: String
    }

    type GraphQuery {
        trendId: String!
        username: String!
        title: String
        label: String
        subLabel: String
        type: String
        dataSequence: String
        values: [DateInt]
    }

    input GraphQueryInput {
        trendId: String!
        username: String!
        title: String
        label: String
        subLabel: String
        type: String
        dataSequence: String
        values: [DateIntInput]
    }

    type CrawlingOutput {
        crawledText: String
        traces: String
        graphQueries: [GraphQuery]
        error: String
        dataset: Dataset
    }

    input CrawlingRegexp {
        body: String!
        flags: String
        resolver: String
    }

    input CrawlingCSV {
        label: String
        x: String
        y: String
    }

    input CrawlingDateRange {
        from: String!
        to: String!
    }

    input CrawlingPostTransform {
        transform: String
        source: String
        sourceIndex: Int
        valueIndex: Int
        dest: String
        algo: String
    }

    input CrawlingActions {
        regex: CrawlingRegexp
        csv: CrawlingCSV
        dataSequence: String
        startRegex: CrawlingRegexp
        endRegex: CrawlingRegexp
        validRange: CrawlingDateRange
        postTransform: CrawlingPostTransform
    }

    input CrawlingDatasets {
        title: String
        actions: [CrawlingActions]
    }

    input CrawlingFunctions {
        type: String
        key: String
        datasets: [CrawlingDatasets]
    }

    input CrawlingScript {
        trendId: String!
        username: String!
        source: String
        sourceName: String
        sourceDocument: String
        urlParser: String
        graphType: [String]
        timestamp: String
        timestampFormat: String
        version: String!
        functions: [CrawlingFunctions]
    }

    type Query {
        trends: [Trend]
        users: [User]
        user(name: String!): User
        trendGraph(username:String!,trendId:String!,label:String!,title:String!): TrendGraph
        trendGraphs(username:String,trendId:String,label:String,title:String): [TrendGraph]
        trend(trendId: String!): [Trend]
        trend_similar(trendId: String!): [Trend]
        script(scriptName: String!, trendId: String!, username:String!): ScriptOutput
        scripts(trendId: String!, username:String!): [ScriptOutput]
        trendLayouts(trendId: String!, username:String!): [TrendLayout]
        trendLayout(layoutName: String!, trendId: String!, username:String!): TrendLayout
    }

    type Mutation {
        createTrend(trendId: String!, username: String!): Trend
        deleteTrendGraphs(trendId: String!, username: String!): String
        upsertTrendGraph(graphQueries: [GraphQueryInput]): String
        upsertTrendLayout(trendLayout: TrendLayoutInput): TrendLayout
        crawlTrendGraph(scriptName: String!, script: CrawlingScript!): CrawlingOutput
        scriptRemove(scriptName: String!, trendId: String!, username:String!): [ScriptOutput]
        scriptRename(scriptName: String!, trendId: String!, username:String!, newName: String!): ScriptOutput
    }

    type Subscription {
        trendMutated: trendMutationPayload
        trendGraphMutated: trendMutationPayload
    }

    type trendMutationPayload {
        mutation: String!
        node: Trend!
    }
`;
