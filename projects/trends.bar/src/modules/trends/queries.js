import gql from "graphql-tag";

export const getUserTrends = () => {
  return gql`
      query getUserTrends($name:String!) {
          user(name:$name) {
              name
              trends {
                  trendId
                  username
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

export const getTrend = (trendId, username) => {
  return gql`
      {
          trend(trendId:"${trendId}", username:"${username}") {
              username
              trendId

              dataSources {
                  name
                  headers {
                      name
                      displayName
                      key
                      type
                  }
                  sourceData
              }

              gridLayout {
                  i
                  x
                  y
                  w
                  h
                  moved
                  static
              }

              gridContent {
                  type
                  i

                  overtitle
                  title
                  subtitle

                  groupKey
                  subGroupKey
                  valueNameKey
                  valueFunctionName

                  tableKeyTitle
                  tableKeyQuery
                  tableKeyField
                  tableKeyTransform
                  tableColumns {
                      title
                      query
                      field
                      transform
                  }

                  graphXYTitle
                  graphXYSeries {
                      title
                      query
                      fieldX
                      transformX
                      fieldY
                      transformY
                  }
              }
          }
      }`;
};
