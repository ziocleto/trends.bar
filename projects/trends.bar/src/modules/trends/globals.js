const uniqueNamesGenerator = require('project-name-generator');

export const EditingUserTrend = 'editingUserTrend';

export const generateUniqueNameWithArrayCheck = (arrayToCheck) => {
  let defaultFileName = uniqueNamesGenerator().dashed;
  while ( arrayToCheck && arrayToCheck.includes(defaultFileName)) {
    defaultFileName = uniqueNamesGenerator().dashed;
  }
  return defaultFileName;
}
