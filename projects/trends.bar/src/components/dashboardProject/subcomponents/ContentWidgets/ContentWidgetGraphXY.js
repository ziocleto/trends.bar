import React, {Fragment} from "react";
import {GraphXY} from "../../../../futuremodules/graphs/GraphXY";

export const getFirstEntryOfKey = (datasets, key) => {
  for (let i = 0; i < datasets.headers.length; i++) {
    if (datasets.headers[i].key === key) {
      return datasets.sourceData[0][i];
    }
  }
  return null;
}

export const getFirstKeyIndexOf = (datasets, key) => {
  for (let i = 0; i < datasets.headers.length; i++) {
    if (datasets.headers[i].key === key) {
      return i;
    }
  }
  return null;
};

export const getNameOfIndex = (datasets, index) => {
  return datasets.headers[index].name;
};

export const getValuesXYPairOfZ = (datasets, xKeyIndex, yKeyIndex, zKey, zKeyIndex) => {
  const ret = [];
  // for (const elem in datasets.sourceData) {
  for (let i = 0; i < datasets.sourceData.length; i++) {
    const elem = datasets.sourceData[i];
    if (elem[zKeyIndex] === zKey) {
      ret.push({
          x: Date.parse(elem[xKeyIndex]),
          y: parseInt(elem[yKeyIndex])
        }
      );
    }
  }
  return ret;
};

const collectGraphData = (datasets, xKeyIndex, yKeyIndex, yName, zKey, zKeyIndex) => {
  let graphData = [];
  graphData.push({
    name: yName,
    data: getValuesXYPairOfZ(datasets, xKeyIndex, yKeyIndex, zKey, zKeyIndex)
  });
  return graphData;
};

export const ContentWidgetGraphXY = ({datasets, config}) => {

  if (!datasets) {
    return <Fragment/>
  }

  const datasets0 = datasets[0];

  const xKeyIndex = getFirstKeyIndexOf(datasets0, "x");
  const yKeyIndex = getFirstKeyIndexOf(datasets0, "y");
  const yName = getNameOfIndex(datasets0, yKeyIndex);
  const zKeyIndex = getFirstKeyIndexOf(datasets0, "z");
  const zKey = getFirstEntryOfKey(datasets0, "z");

  const cf = {
    title: getFirstEntryOfKey(datasets0, "z")
  };

  const graphData = collectGraphData(datasets0, xKeyIndex, yKeyIndex, yName, zKey, zKeyIndex);

  return (<GraphXY graphData={graphData} config={cf}/>)
};
