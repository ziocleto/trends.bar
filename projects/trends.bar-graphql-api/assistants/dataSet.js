
module.exports = {
  maker: (orgKey, datasetName, info, subInfoA, datasetType) => {

    return {
      datasetOrg: orgKey,
      datasetName: datasetName,
      datasetInfo: "cases",
      datasetSubInfoA: "global",
      datasetType: datasetType,
    }

  }
};
