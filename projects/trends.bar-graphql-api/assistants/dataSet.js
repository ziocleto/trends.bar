
module.exports = {
  maker: (orgKey, datasetName, info, subInfoA, datasetType) => {

    return {
      datasetOrg: orgKey,
      datasetName: datasetName,
      datasetInfo: info,
      datasetSubInfoA: subInfoA,
      datasetType: datasetType,
    }

  }
};
