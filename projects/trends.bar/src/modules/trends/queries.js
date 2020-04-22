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

export const getTrendLayouts = () => {
  return gql`
      query getTrendLayouts($trendId:String!, $name:String!) {
          trendLayout(trendId:$trendId, username:$name) {
              username
              trendId

              datasets {
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

export const getDatasets = () => {
  return gql`
      query getTrendGraphs($trendId:String!, $name:String!) {
          trendGraphs(trendId:$trendId, username:$name) {
              trendId
              username
              yValueName
              yValueSubGroup
              yValueGroup
              values {
                  x
                  y
              }
          }
      }`;
};

export const getDatasetsBySimilarTrendId = (trendId) => {
  return gql`{
      trendGraphsSimilar(trendId:"${trendId}") {
          count
          trendId
          username
      }
  }`;
};
