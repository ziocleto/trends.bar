import "./react-grid-styles.css"
import "./react-resizable-styles.css"

import React from "reactn";
import {Container, Subtitle, Title} from "./ContentWidgetText.styled";
import {SecondaryAltColorTextSpanBold} from "../../../futuremodules/reactComponentStyles/reactCommon.styled";

export const ContentWidgetText = ({config}) => {
  return (
    <Container>
      <Title><SecondaryAltColorTextSpanBold>{config.title}</SecondaryAltColorTextSpanBold></Title>
      <Subtitle><b>{config.subtitle}</b></Subtitle>
    </Container>
  )
};
