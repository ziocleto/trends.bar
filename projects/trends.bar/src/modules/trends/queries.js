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
