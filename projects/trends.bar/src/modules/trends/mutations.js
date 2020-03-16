import gql from "graphql-tag";

export const CREATE_TREND = gql`
    mutation CreateTrend($trendId: String!) {
        createTrend(trendId: $trendId) {
            _id,
            trendId
        }
    }`;

export const UPSERT_TREND_GRAPH = gql`
    mutation UpsertTrendGraph($script: CrawlingScript!) {
        upsertTrendGraph(script: $script) {
            _id,
            trendId
        }
    }`;
