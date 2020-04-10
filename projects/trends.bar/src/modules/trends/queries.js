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
          trendLayouts(trendId:$trendId, username:$name) {
              name
              username
              trendId
              cols
              granularity
              width
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
                  title
                  subtitle

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

export const getTrendGraphsByUserTrendId = () => {
    return gql`
        query getTrends($trendId:String!, $name:String!) {
            trendGraphs(trendId:$trendId, username:$name) {
                trendId
                username
                title
                label
                values {
                    x
                    y
                }
                valuesDx {
                    x
                    y
                }
                valuesDx2 {
                    x
                    y
                }
            }
        }`;
}
