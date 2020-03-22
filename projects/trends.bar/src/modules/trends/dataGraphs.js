import gql from "graphql-tag";

export const getTrendGraphs = (trendId) => {

  const GQL_QUERY_TREND_GRAPHS = gql`{
      trend (trendId: "${trendId}") {
          trendId
          trendGraphs {
              dataset {
                  source
                  sourceName
              }
              title
              label
              subLabel
              values {
                  x
                  y
              }
          }
      }
  }`;

  return GQL_QUERY_TREND_GRAPHS;
}

export const hasGraphData = data => {
  return data !== undefined && data.length !== 0;
}

export const isEmptyGraph = data => {
  return !hasGraphData(data);
}

// const sortByXGraph = (a, b) => {
//   if (a.x < b.x) {
//     return -1;
//   }
//   if (a.x > b.x) {
//     return 1;
//   }
//   return 0;
// }

export const elaborateDataGraphs = data => {

  const optionsBase = {
    axisX: {
      valueFormatString: "DD MMM"
    },
    axisY: {
      title: "Number"
    },
    backgroundColor: "#343a40",
    animationEnabled: true,
    interactivityEnabled: true,
  };

  if (isEmptyGraph(data)) return optionsBase;

  let allPoints = [];
  for (const trendGraph of data) {
    let dpoints = [];
    if ((trendGraph.graph.title === "Cases" && trendGraph.graph.subLabel === "Worldwide") ||
      (trendGraph.graph.title === "Deaths" && trendGraph.graph.subLabel === "Worldwide")) {
      for (const p of trendGraph.values) {
        dpoints.push({x: new Date(p.x), y: p.y});
      }
      // dpoints.sort(sortByXGraph);
      allPoints.push(dpoints);
    }
  }

  console.log(data);

  const chartsOptions = {
    ...optionsBase,
    title: {
      text: "Worldwide situation",
    },
    theme: "dark1",
    data: [
      {
        type: "splineArea",
        dataPoints: allPoints[0]
      },
      {
        type: "splineArea",
        dataPoints: allPoints[1]
      }
    ]
  };

  return chartsOptions;
};
