
export const getFirstValue = (groupKey, subGroupKey, valueNameKey, datasets) => {
  return datasets[groupKey][subGroupKey][valueNameKey][0].y;
};

export const getLastValue = (groupKey, subGroupKey, valueNameKey, datasets) => {
  const ds = datasets[groupKey][subGroupKey][valueNameKey];
  return ds[ds.length - 1].y;
};

export const getEmptyDefaultValue = (groupKey, subGroupKey, valueNameKey, datasets) => {
  return "Fill me with ideas";
};

export const resolveFunction = (valueFunctionName, groupKey, subGroupKey, valueNameKey, datasets) => {
  switch (valueFunctionName) {
    case "getLastValue":
      return getLastValue(groupKey, subGroupKey, valueNameKey, datasets);
    case "getFirstValue":
      return getFirstValue(groupKey, subGroupKey, valueNameKey, datasets);
    default:
      return datasets ? datasets[0].headers[0].name : null;
  }
};

export const getDefaultCellContent = (i, datasets) => {
  return getDefaultWidgetContent("text", i, datasets);
};

export const getDefaultWidgetContent = (type, i, datasets) => {
  switch (type) {
    case "text": {
      return getDefaultWidgetTextContent(i, datasets);
    }
    case "table": {
      return getDefaultWidgetTextContent(i, datasets);
    }
    case "graphxy": {
      return getDefaultWidgetTextContent(i, datasets);
    }
    default: {
      return getDefaultWidgetTextContent(i, datasets);
    }
  }
};

export const startupState = (datasets) => {
  const groupKey = datasets && Object.keys(datasets)[0];
  const subGroupKey = groupKey && Object.keys(datasets[Object.keys(datasets)[0]])[0];
  const valueNameKey = subGroupKey && Object.keys(datasets[Object.keys(datasets)[0]][Object.keys(datasets[Object.keys(datasets)[0]])[0]])[0];
  const valueFunction = valueNameKey ? getLastValue : getEmptyDefaultValue;
  return {
    groupKey,
    subGroupKey,
    valueNameKey,
    valueFunctionName: valueFunction.name,
    overtitle: "subGroupKey",
    title: "valueFunction",
    subtitle: "valueNameKey",
  }
};

const getDefaultWidgetTextContent = (i, datasets) => {
  const ds = startupState(datasets);
  return {
    i: i.toString(),
    type: "text",
    ...ds,
  }
};
