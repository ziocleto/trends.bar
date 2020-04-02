import "./react-grid-styles.css"
import "./react-resizable-styles.css"

import React, {Fragment} from "react";
import {ContentWidgetTextEditor} from './ContentWidgetTextEditor'

export const ContentWidgetEditor = ({config,onUpdate}) => {

    switch (config.type) {
        case "text":
            return (
              <ContentWidgetTextEditor config={config} onUpdate={onUpdate}/>
            );
        default:
            return (<Fragment></Fragment>);
    }
}
