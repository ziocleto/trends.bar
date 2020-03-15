import gql from "graphql-tag";

export const CREATE_TREND = gql`
    mutation CreateTrend($trendId: String!) {
        createTrend(trendId: $trendId) {
            _id,
            trendId
        }
    }`;

