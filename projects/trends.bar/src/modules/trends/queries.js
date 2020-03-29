import gql from "graphql-tag";

export const getUserTrends = () => {
  return gql`
      query getUserTrends($name:String!) {
          user(name:$name) {
              name
              trends {
                  trendId
              }
          }
      }`;
};

export const getTrends = (trendId) => {
  return gql`
      {
          trend (trendId: "${trendId}") {
              user {
                  name
              }
          }
      }`;
};

export const getSimilarTrends = (trendId) => {
    return gql`
        {
            trend_similar (trendId: "${trendId}") {
                trendId
                user {
                    name
                }
            }
        }`;
};

export const getScript = () => {
  return gql`
      query getScript($scriptName:String!, $trendId:String!, $username:String!) {
          script(scriptName:$scriptName, trendId:$trendId, username:$username) {
              filename
              text
          }
      }`;
};

export const getScripts = () => {
  return gql`
      query getScripts($trendId:String!, $username:String!) {
          scripts(trendId:$trendId, username:$username) {
              filename
              text
          }
      }`;
};
