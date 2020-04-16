import React from "reactn";
import {Title} from "./ContentWidgetText.styled";
import {WidgetVertical} from "../../../../futuremodules/reactComponentStyles/reactCommon.styled";

export const ContentWidgetTextSingle = ({config}) => {
  return (
    <WidgetVertical>
      <Title>{config.title}</Title>
    </WidgetVertical>
  )
};
