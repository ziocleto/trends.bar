import gql from "graphql-tag";

export const getTrendGraphs = (trendId) => {

  const GQL_QUERY_TREND_GRAPHS = gql`{
      trend (trendId: "${trendId}") {
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
  }`;

  return GQL_QUERY_TREND_GRAPHS;
}

export const hasGraphData = data => {
  return data !== undefined && data.trend.trendGraphs.length !== 0;
}

export const isEmptyGraph = data => {
  return !hasGraphData(data);
}

const sortByXGraph = (a, b) => {
  if (a.x < b.x) {
    return -1;
  }
  if (a.x > b.x) {
    return 1;
  }
  return 0;
}

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
  for (const trendGraph of data.trend.trendGraphs) {
    let dpoints = [];
    if ((trendGraph.graph.label === "Cases" && trendGraph.graph.subLabel === "Worldwide") ||
      (trendGraph.graph.label === "Deaths" && trendGraph.graph.subLabel === "Worldwide")) {
      for (const p of trendGraph.values) {
        dpoints.push({x: new Date(p[0]), y: p[1]});
      }
      dpoints.sort(sortByXGraph);
      allPoints.push(dpoints);
    }
  }

  const chartsOptions = {
    ...optionsBase,
    title: {
      text: "Worldwide situation",
    },
    theme: "dark1",
    data: [{
      type: "splineArea",
      dataPoints: allPoints[0]
    },
      {
        type: "splineArea",
        dataPoints: allPoints[1]
      }]
  };

  return chartsOptions;
};
