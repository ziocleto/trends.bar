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
}

export const getScript = () => {
  return gql`
      query getScript($trendId:String!, $username:String!) {
          script(trendId:$trendId, username:$username) {
              text
          }
      }`;
}
