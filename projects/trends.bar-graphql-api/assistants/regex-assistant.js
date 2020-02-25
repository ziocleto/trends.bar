module.exports = {

  declare: (source, expression, expectedResultCount, resultIndices, parseFunction) => {
    return {
      source: source,
      expression: expression,
      expectedResultCount: expectedResultCount,
      resultIndices: resultIndices,
      parseFunction: parseFunction
    }
  },

};
