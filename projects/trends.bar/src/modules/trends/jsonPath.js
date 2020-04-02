import jp from 'jsonpath'

const getJsonPath = (text) => {
    var re = new RegExp('jp`(.+)`');
    var match  = text.match(re);
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
                result=JSON.stringify(result);
            }
        } catch (ex)
        {
            result="Invalid jsonpath"
        }
    } else {
        result=text;
    }
    return result;
}

