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

const checkTitleAndLabelBelongToGraph = (trendGraph, titles, label) => {
  for ( const title of titles ) {
    if (trendGraph.title === title && trendGraph.label === label) return true;
  }
  return false;
}

const itemclick = e => {
  if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
    e.dataSeries.visible = false;
  } else {
    e.dataSeries.visible = true;
  }
  e.chart.render();
};

export const elaborateDataGraphs = (data, label, titles) => {

  const optionsBase = {
    axisX: {
      valueFormatString: "DD MMM"
    },
    axisY: {
      title: "People"
    },
    title: {
      text: label,
    },
    legend: {
      cursor: "pointer",
      itemclick: itemclick
    },
    theme: "dark1",
    backgroundColor: "#00000000",
    animationEnabled: true,
    interactivityEnabled: true,
  };

  if (isEmptyGraph(data)) return optionsBase;

  let allPoints = [];
  for (const trendGraph of data) {
    let dpoints = [];
    if ( checkTitleAndLabelBelongToGraph(trendGraph, titles, label ) ) {
      for (const p of trendGraph.values) {
        const date = new Date(0);
        date.setUTCSeconds(p.x);
        dpoints.push({x: date, y: p.y});
      }
      allPoints.push( {
        label: trendGraph.title,
        data: dpoints
      });
    }
  }

  const gdata =[];
  for ( const points of allPoints ) {
    gdata.push( {
      showInLegend: true,
      legendText: points.label,
      type: "area",
      dataPoints: points.data
    });
  }

  const chartsOptions = {
    ...optionsBase,
    data: gdata
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
