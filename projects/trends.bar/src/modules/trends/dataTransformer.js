import moment from 'moment';

export const transformData = (source, transform) => {

    let result=source;
    try {
        if (transform!==undefined && transform!==null && transform.startsWith("toDate")) {
            const format=transform.substr(6);
            result=moment.unix(source).format(format);
        }
    } catch (ex) {
        console.log("Error in transform data", ex);
        result=source;
    }

    return result;
}