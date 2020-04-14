import "./react-grid-styles.css"
import "./react-resizable-styles.css"

import React, {Fragment} from "react";
import {Container, Title, Subtitle} from "./ContentWidgetText.styled";
import {getTextFromJsonPath} from "../../../modules/trends/jsonPath";

export const ContentWidgetText = ({data,config}) => {

    const title = getTextFromJsonPath(data,config.title);
    const subtitle = getTextFromJsonPath(data,config.subtitle);

    return (
        <Fragment>
            <Container>
                <Title>{title}</Title>
                <Subtitle>{subtitle}</Subtitle>
            </Container>
        </Fragment>
    )
}
