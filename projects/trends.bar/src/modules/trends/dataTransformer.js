import moment from 'moment';
import numeraljs from 'numeraljs'

export const transformData = (source, transform) => {

  let result = source;
  try {
    if (transform) {
      if (transform.startsWith("toDate")) {
        const format = transform.substr(6);
        return moment.unix(source).format(format);
      }
      if (transform.startsWith("tomsDate")) {
        const format = transform.substr(8);
        return moment.unix(source/1000).format(format);
      }
      if (transform.startsWith("toFormatNumber")) {
        const format = transform.substr(14);
        return numeraljs(source).format(format);
      }
    }
  } catch (ex) {
    console.log("Error in transform data", ex);
    result = source;
  }

  return result;
}
