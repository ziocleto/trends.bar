import "./react-grid-styles.css"
import "./react-resizable-styles.css"

import React, {Fragment} from "react";
import {Subtitle, Title} from "./ContentWidgetText.styled";
import {getTextFromJsonPath} from "../../../modules/trends/jsonPath";

export const ContentWidgetText = ({data,config}) => {

    const title = getTextFromJsonPath(data,config.title);
    const subtitle = getTextFromJsonPath(data,config.subtitle);

    return (
        <Fragment>
            <Title>{title}</Title>
            <Subtitle>{subtitle}</Subtitle>
        </Fragment>
    )
}
