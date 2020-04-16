import "./Layout/react-grid-styles.css"
import "./Layout/react-resizable-styles.css"

import React, {Fragment} from "react";
import {ContentWidgetTextEditor} from './ContentWidgetTextEditor'
import {ContentWidgetTableEditor} from "./ContentWidgetTableEditor";
import {ContentWidgetGraphXYEditor} from "./ContentWidgetGraphXYEditor";

export const ContentWidgetEditor = ({config,onUpdate}) => {

    switch (config.type) {
        case "text":
            return (
              <ContentWidgetTextEditor config={config} onUpdate={onUpdate}/>
            );
        case "table":
            return (
                <ContentWidgetTableEditor config={config} onUpdate={onUpdate}/>
            );
        case "graphxy":
            return (
                <ContentWidgetGraphXYEditor config={config} onUpdate={onUpdate}/>
            );
        default:
            return (<Fragment></Fragment>);
    }
}
