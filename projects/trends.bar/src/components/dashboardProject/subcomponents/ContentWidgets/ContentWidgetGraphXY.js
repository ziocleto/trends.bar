import React, {Fragment} from "react";
import {GraphXY} from "../../../../futuremodules/graphs/GraphXY";

const collectGraphData = (data) => {
  let graphData = [];
  for (const key in data) {
    const graph = [];
    for (const v of data[key]) {
      graph.push({x: new Date(v.x), y: v.y});
    }
    graphData.push({
      name: key,
      data: graph
    });
  }
  return graphData;
};

export const ContentWidgetGraphXY = ({datasets, config}) => {

  if (!datasets) {
    return <Fragment/>
  }

  const cf = {
    title: config.subGroupKey
  };

  const graphData = collectGraphData(datasets[config.groupKey][config.subGroupKey]);

  return (<GraphXY graphData={graphData} config={cf}/>)
};
