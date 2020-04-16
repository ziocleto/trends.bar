import "../Layout/react-grid-styles.css"
import "../Layout/react-resizable-styles.css"

import React from "reactn";
import {Container, Title} from "./ContentWidgetText.styled";

export const ContentWidgetTextSingle = ({config}) => {
  return (
    <Container>
      <Title>{config.title}</Title>
    </Container>
  )
};
