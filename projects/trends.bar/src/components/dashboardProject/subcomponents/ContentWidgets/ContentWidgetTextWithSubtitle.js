import "../Layout/react-grid-styles.css"
import "../Layout/react-resizable-styles.css"

import React from "reactn";
import {Container, Subtitle, Title} from "./ContentWidgetText.styled";

export const ContentWidgetTextWithSubtitle = ({config}) => {
  return (
    <Container>
      <Title>{config.title}</Title>
      <Subtitle>{config.subtitle}</Subtitle>
    </Container>
  )
};
