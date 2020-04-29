export const getFirstValue = (groupKey, subGroupKey, zGroupIndex, datasets) => {
  return datasets[groupKey][subGroupKey][zGroupIndex][0].y;
};

export const getLastValue = (groupKey, subGroupKey, zGroupIndex, datasets) => {
  const ds = datasets[groupKey][subGroupKey][zGroupIndex];
  return ds[ds.length - 1].y;
};

export const getValue = (groupKey, subGroupKey, zGroupIndex, zGroupRow, datasets) => {
  if (!datasets) return "";
  return datasets[groupKey].sourceData[zGroupRow][subGroupKey];
  // return ds[ds.length - 1].y;
};

export const getDatasetZGroupName = (groupKey, subGroupKey, zGroupIndex, zGroupRow, datasets) => {
  if (!datasets) return "";
  return datasets[groupKey].headers[zGroupIndex].name;
};

export const getDatasetZGroupValue = (groupKey, subGroupKey, zGroupIndex, zGroupRow, datasets) => {
  if (!datasets) return "";
  return datasets[groupKey].sourceData[zGroupRow][zGroupIndex];
};

export const getDatasetYGroupName = (groupKey, subGroupKey, zGroupIndex, zGroupRow, datasets) => {
  if (!datasets) return "";
  return datasets[groupKey].headers[subGroupKey].name;
};

export const resolveFunction = (valueFunctionName, groupKey, subGroupKey, zGroupIndex, zGroupRow, datasets) => {
  switch (valueFunctionName) {
    case "getDatasetZGroupValue":
      return getDatasetZGroupValue(groupKey, subGroupKey, zGroupIndex, zGroupRow, datasets);
    case "getDatasetZGroupName":
      return getDatasetZGroupName(groupKey, subGroupKey, zGroupIndex, zGroupRow, datasets);
    case "getDatasetYGroupName":
      return getDatasetYGroupName(groupKey, subGroupKey, zGroupIndex, zGroupRow, datasets);
    case "getValue":
      return getValue(groupKey, subGroupKey, zGroupIndex, zGroupRow, datasets);
    default:
      return null;
  }
};

export const getDefaultCellContent = (i) => {
  const ds = startupState();
  return {
    i: i.toString(),
    type: "text",
    ...ds,
  }
};

export const startupState = () => {
  const groupKey = 0;
  const subGroupKey = 0;
  const zGroupIndex = 0;
  const zGroupRow = 0;
  return {
    groupKey,
    subGroupKey,
    zGroupIndex,
    zGroupRow,
  }
};
