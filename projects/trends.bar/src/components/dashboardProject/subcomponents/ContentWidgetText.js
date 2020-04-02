import "./react-grid-styles.css"
import "./react-resizable-styles.css"

import React, {Fragment} from "react";
import {Subtitle, Title} from "./ContentWidgetText.styled";

export const ContentWidgetText = ({data,config}) => {



    return (
        <Fragment>
            <Title>{config.title}</Title>
            <Subtitle>{config.subtitle}</Subtitle>
        </Fragment>
    )
}
