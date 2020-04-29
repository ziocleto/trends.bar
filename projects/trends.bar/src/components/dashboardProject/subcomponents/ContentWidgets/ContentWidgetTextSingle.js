import React from "reactn";
import {Title} from "./ContentWidgetText.styled";
import {WidgetVertical} from "../../../../futuremodules/reactComponentStyles/reactCommon.styled";
import {resolveFunction} from "../../../../modules/trends/layout";

export const ContentWidgetTextSingle = ({datasets, config}) => {
  return (
    <WidgetVertical>
      <Title>{resolveFunction(config.valueFunctionName, config.groupKey, config.subGroupKey, config.zGroupIndex, datasets)}</Title>
    </WidgetVertical>
  )
};
