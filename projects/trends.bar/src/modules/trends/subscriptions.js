import gql from "graphql-tag";

export const trendSubcription = () => {
  const TREND_MUTATED = gql`
      subscription TrendMutated {
          trendMutated {
              mutation
              node {
                  trendId
                  username
              }
          }
      }
  `;

  return TREND_MUTATED;
};

export const trendGraphSubcription = () => {
  const TREND_MUTATED = gql`
      subscription TrendGraphMutated {
          trendGraphMutated {
              mutation
              node {
                  trendId
                  aliases
                  trendGraphs {
                      dataset {
                          source
                          sourceName
                      }
                      graph {
                          label
                          subLabel
                      }
                      values
                  }
              }
          }
      }
  `;

  return TREND_MUTATED;
};
