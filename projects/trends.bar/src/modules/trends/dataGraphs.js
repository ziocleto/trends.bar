import gql from "graphql-tag";

export const getTrendGraphs = () => {

  return gql`query trendGraphs($name:String!, $trendId:String!) {
      user (name:$name) {
          name
          trend(trendId:$trendId) {
              trendId
              username
              trendGraphs {
                  title
                  label
                  subLabel
                  values{
                      x
                      y
                  }
              }
          }
      }
  }
  `;
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
    if ((trendGraph.title === "Cases" && trendGraph.label === "Worldwide") ||
      (trendGraph.title === "Deaths" && trendGraph.label === "Worldwide")) {
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
