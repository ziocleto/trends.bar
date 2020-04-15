import "./react-grid-styles.css"
import "./react-resizable-styles.css"

import React from "reactn";
import {Container, Subtitle, Title} from "./ContentWidgetText.styled";

export const ContentWidgetText = ({config, onSave}) => {

  return (
    <Container>
      <Title>
        {config.title}
      </Title>
      <Subtitle>{config.subtitle}</Subtitle>
    </Container>
  )
};
