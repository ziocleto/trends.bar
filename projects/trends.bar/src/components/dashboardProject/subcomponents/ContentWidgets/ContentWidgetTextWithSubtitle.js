import React from "reactn";
import {Subtitle, Title} from "./ContentWidgetText.styled";
import {WidgetVertical} from "../../../../futuremodules/reactComponentStyles/reactCommon.styled";

export const ContentWidgetTextWithSubtitle = ({config}) => {
  return (
    <WidgetVertical>
      <Title>{config.title}</Title>
      <Subtitle>{config.subtitle}</Subtitle>
    </WidgetVertical>
  )
};
