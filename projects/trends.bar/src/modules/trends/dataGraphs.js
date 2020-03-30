import gql from "graphql-tag";
import {arrayExistsNotEmpty} from "../../futuremodules/utils/utils";

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
                  valuesDx{
                      x
                      y
                  }
                  valuesDxPerc{
                      x
                      y
                  }
                  valuesDx2{
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
    zoomEnabled: true,
    axisX: {
      valueFormatString: "DD MMM"
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
    if ( checkTitleAndLabelBelongToGraph(trendGraph, titles, label ) ) {
      allPoints.push( {
        label: "Total " + trendGraph.title,
        data: trendGraph.values,
        type: "area",
      });
      if ( arrayExistsNotEmpty(trendGraph.valuesDx) ) {
        allPoints.push( {
          label: "Daily " + trendGraph.title,
          data: trendGraph.valuesDx,
          type: "column",
        });
      }
      // if ( arrayExistsNotEmpty(trendGraph.valuesDxPerc) ) {
      //   allPoints.push( {
      //     label: trendGraph.title + " SpeedPerc",
      //     data: trendGraph.valuesDxPerc,
      //     type: "column",
      //   });
      // }
      // if ( arrayExistsNotEmpty(trendGraph.valuesDx2) ) {
      //   allPoints.push( {
      //     label: trendGraph.title + " Acceleration",
      //     data: trendGraph.valuesDx2,
      //     type: "spline",
      //   });
      // }
    }
  }

  const gdata =[];
  for ( const points of allPoints ) {
    gdata.push( {
      xValueType: "dateTime",
      showInLegend: true,
      type: points.type,
      legendText: points.label,
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

export const groupDataWithDerivatives = ( graphData, groupBy, fields, sortBy, sortOrder = 1 ) => {
  let countries = {};
  for (const elem of graphData) {
    for ( const field of fields ) {
      if ( elem.title === field ) {
        countries[elem[groupBy[0]]] = {
          ...countries[elem[groupBy[0]]],
          [field]: elem.values[elem.values.length - 1].y,
          [field+"(Dx)"]: elem.valuesDx[elem.valuesDx.length - 1].y,
          [field+"(Dx%)"]: elem.valuesDxPerc[elem.valuesDxPerc.length - 1].y,
          [field+"(Dx2)"]: elem.valuesDx2[elem.valuesDx2.length - 1].y
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

export const positiveSignForDx2 = (elem) => {
  if ( !elem.percSignPosTrend ) return 1;
  return elem.percSignPosTrend;
};

export const float100ToPerc = (value) => {
  return Number(value).toFixed(2)+"%";
}
