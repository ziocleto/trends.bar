export const globalLayoutState = "globalLayoutState";

export const setFirstValue = (groupKey, subGroupKey, valueNameKey, datasets) => {
  return datasets[groupKey][subGroupKey][valueNameKey][0].y;
};

export const getLastValue = (groupKey, subGroupKey, valueNameKey, datasets) => {
  const ds = datasets[groupKey][subGroupKey][valueNameKey];
  return ds[ds.length - 1].y;
};

export const getDefaultTrendLayout = (datasets) => {

  const granularity = 4;
  const name = "Grid3x3";

  let gridLayout = [];
  let gridContent = [];
  let i = 0;
  for (let y = 0; y < 3; y++) {
    for (let x = 0; x < 3; x++) {
      gridLayout.push({
        i: i.toString(), x: x * granularity, y: y * granularity, w: granularity, h: granularity
      });
      gridContent.push(getDefaultCellContent(i, datasets));
      i++;
    }
  }

  return {
    name,
    gridLayout,
    gridContent
  }
};

export const getDefaultCellContent = (i, datasets) => {
  return getDefaultWidgetContent("text", i, datasets);
}

export const getDefaultWidgetContent = (type, i, datasets) => {
  switch (type) {
    case "text": {
      return getDefaultWidgetTextContent(i, datasets);
    }
    case "table": {
      return getDefaultWidgetTableContent(i);
    }
    case "graphxy": {
      return getDefaultWidgetGraphXYContent(i);
    }
    default: {
      return getDefaultWidgetTextContent(i, datasets);
    }
  }
};

const startupState = (datasets) => {
  const groupKey = Object.keys(datasets)[0];
  const subGroupKey = Object.keys(datasets[Object.keys(datasets)[0]])[0];
  const valueNameKey = Object.keys(datasets[Object.keys(datasets)[0]][Object.keys(datasets[Object.keys(datasets)[0]])[0]])[0];
  const valueFunction = getLastValue;
  const title = valueFunction(groupKey, subGroupKey, valueNameKey, datasets);
  const subtitle = valueNameKey;
  return {
    groupKey,
    subGroupKey,
    valueNameKey,
    valueFunction,
    overtitle: subGroupKey,
    title,
    subtitle
  }
};

const getDefaultWidgetGraphXYContent = (i) => {
  return {
    i: i.toString(),
    type: "graphxy",
    graphXYTitle: "Graph title",
    graphXYXDataType: "data",
    graphXYSeries: [
      getDefaultWidgetGraphXYSerieContent()
    ]
  }
}

export const getDefaultWidgetGraphXYSerieContent = () => {
  return {
    title: "Serie",
    query: "$[0].values[*]",
    fieldX: "x",
    transformX: "tomsDate",
    fieldY: "y",
    transformY: "",
    fillArea: "false",
    bullet: "circle",
    lineWidth: "1",
    lineStyle: "1"
  }
}

const getDefaultWidgetTextContent = (i, datasets) => {
  const ds = startupState(datasets);
  console.log("DS", ds);
  return {
    i: i.toString(),
    type: "text",
    ...ds,
  }
};

const getDefaultWidgetTableContent = (i) => {
  return {
    i: i.toString(),
    type: "table",
    tableKeyTitle: "Date",
    tableKeyQuery: "$[0].values[*]",
    tableKeyField: "x",
    tableKeyTransform: "toDateDD/MM/YYYY",
    tableColumns: [
      getDefaultWidgetTableColumnContent()
    ]
  };
}

export const getDefaultWidgetTableColumnContent = () => {
  return {
    title: "Column",
    query: "$[0].values[*]",
    field: "y",
    transform: ""
  }
}
