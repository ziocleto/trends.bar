import "./react-grid-styles.css"
import "./react-resizable-styles.css"

import React, {Fragment} from "react";
import {SubTitle, Title} from "./ContentWidget.styled";

export const ContentWidget = ({data,config}) => {

    if (config.type==="text") {
        return (
            <Fragment>
                <Title>{config.title}</Title>
                <SubTitle>{config.subTitle}</SubTitle>
            </Fragment>
        )
    }

    return (
        <Fragment></Fragment>
    )
}
