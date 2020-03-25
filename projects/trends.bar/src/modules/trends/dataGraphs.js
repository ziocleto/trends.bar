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

export const elaborateDataGraphs = (data, label) => {

  const optionsBase = {
    axisX: {
      valueFormatString: "DD MMM"
    },
    axisY: {
      title: "People"
    },
    backgroundColor: "#343a40",
    animationEnabled: true,
    interactivityEnabled: true,
  };

  if (isEmptyGraph(data)) return optionsBase;

  let allPoints = [];
  for (const trendGraph of data) {
    let dpoints = [];
    if ((trendGraph.title === "Cases" && trendGraph.label === label) ||
      (trendGraph.title === "Deaths" && trendGraph.label === label) ||
      (trendGraph.title === "Recovered" && trendGraph.label === label))
    {
      for (const p of trendGraph.values) {
        const date = new Date(0);
        date.setUTCSeconds(p.x);
        dpoints.push({x: date, y: p.y});
      }
      // dpoints.sort(sortByXGraph);
      allPoints.push(dpoints);
    }
  }

  const chartsOptions = {
    ...optionsBase,
    title: {
      text: label,
    },
    theme: "dark1",
    data: [
      {
        type: "area",
        dataPoints: allPoints[0]
      },
      {
        type: "area",
        dataPoints: allPoints[1]
      },
      {
        type: "area",
        dataPoints: allPoints[2]
      }
    ]
  };

  return chartsOptions;
};

export const groupData = ( graphData, groupBy, fields, sortBy, sortOrder = 1 ) => {
  let countries = {};
  for (const elem of graphData) {
    for ( const field of fields ) {
      if ( elem.title === field ) {
        countries[elem[groupBy[0]]] = {
          ...countries[elem[groupBy[0]]],
          [field]: elem.values[elem.values.length - 1].y
        };
      }
    }
  }

  const finalDataUnsorted = [];
  for (const elem of Object.keys(countries)) {
    finalDataUnsorted.push( {
      [groupBy[1]]: elem,
      ...countries[elem]
    } );
  }

  const finalData = finalDataUnsorted.sort( (a, b) => {
      if (a[sortBy] < b[sortBy]) {
        return sortOrder === 1 ? 1 : -1;
      }
      if (a[sortBy] > b[sortBy]) {
        return sortOrder === 1 ? -1 : 1;
      }
      return 0;
    }
  );

  return finalData;
};
