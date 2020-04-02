import jp from 'jsonpath'

const getJsonPath = (text) => {
    const t=text || '';
    const re = new RegExp('jp`(.+)`');
    const match  = t.match(re);
    if (match)
        return(match[1]);
    return null;
}

export const getTextFromJsonPath = (data, text) => {
    const jsonPath = getJsonPath(text);
    let result = null;
    if (jsonPath) {
        try {
            console.log("JsonPath",jsonPath);
            result=jp.value(data,jsonPath);
            if (typeof result!=="string") {
                result="Query don't return a value"
            }
        } catch (ex)
        {
            result="Invalid query"
        }
    } else {
        result=text;
    }
    return result;
}

export const getArrayFromJsonPath = (data, jsonPath) => {
    let result = [];
    if (jsonPath) {
        try {
            result=jp.query(data,jsonPath);
            if (!Array.isArray(result)) {
                result=[];
            }
        } catch (ex)
        {
            console.log("Jsonpath error",ex);
            result=[];
        }
    }
    return result;
}
