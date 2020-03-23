import gql from "graphql-tag";

export const CREATE_TREND = gql`
    mutation CreateTrend($trendId: String!, $username: String!) {
        createTrend(trendId: $trendId, username: $username) {
            _id,
            trendId
        }
    }`;

export const UPSERT_TREND_GRAPH = gql`
    mutation UpsertTrendGraph($script: CrawlingScript!) {
        upsertTrendGraph(script: $script) {
            text
        }
    }`;


export const DELETE_TREND_GRAPH = gql`
    mutation DeleteTrendGraph($trendId: String!, $username: String!) {
        deleteTrendGraph(trendId: $trendId, username: $username)
    }`;

export const SAVE_SCRIPT = gql`
    mutation saveScript($script: CrawlingScript!) {
        saveScript(script: $script)
    }`;

