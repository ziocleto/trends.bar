import "./react-grid-styles.css"
import "./react-resizable-styles.css"

import React, {Fragment} from "react";
import {ContentWidgetText} from './ContentWidgetText'
import {ContentWidgetTable} from "./ContentWidgetTable";
import {ContentWidgetGraphXY} from "./ContentWidgetGraphXY";

export const ContentWidget = ({data,config}) => {

    switch (config.type) {
        case "text":
            return (
                <ContentWidgetText data={data} config={config}/>
            );
        case "table":
            return (
                <ContentWidgetTable data={data} config={config}/>
            );
        case "graphxy":
            return (
                <ContentWidgetGraphXY data={data} config={config}/>
            );
        default:
            return (
                <Fragment></Fragment>
            );
    }
}
