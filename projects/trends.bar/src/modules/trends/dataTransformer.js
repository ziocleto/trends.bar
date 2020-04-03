import moment from 'moment';
import numeraljs from 'numeraljs'

export const transformData = (source, transform) => {

    let result=source;
    try {
        if (transform!==undefined && transform!==null && transform.startsWith("toDate")) {
            const format=transform.substr(6);
            result=moment.unix(source).format(format);
        } else if (transform!==undefined && transform!==null && transform.startsWith("toFormatNumber")) {
            console.log(transform);
            const format=transform.substr(14);
            console.log(format);
            result=numeraljs(source).format(format);
            console.log(result);
        }

    } catch (ex) {
        console.log("Error in transform data", ex);
        result=source;
    }

    return result;
}