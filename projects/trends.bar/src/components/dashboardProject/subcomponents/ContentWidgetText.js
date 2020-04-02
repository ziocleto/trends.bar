import "./react-grid-styles.css"
import "./react-resizable-styles.css"

import React, {Fragment} from "react";
import {SubTitle, Title} from "./ContentWidgetText.styled";

export const ContentWidgetText = ({data,config}) => {

    return (
        <Fragment>
            <Title>{config.title}</Title>
            <SubTitle>{config.subtTitle}</SubTitle>
        </Fragment>
    )
}
