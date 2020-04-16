import "../Layout/react-grid-styles.css"
import "../Layout/react-resizable-styles.css"

import React from "reactn";
import {Container, Overtitle, Subtitle, Title} from "./ContentWidgetText.styled";

export const ContentWidgetText = ({config}) => {
  return (
    <Container>
      <Overtitle>{config.overtitle}</Overtitle>
      <Title>{config.title}</Title>
      <Subtitle>{config.subtitle}</Subtitle>
    </Container>
  )
};
