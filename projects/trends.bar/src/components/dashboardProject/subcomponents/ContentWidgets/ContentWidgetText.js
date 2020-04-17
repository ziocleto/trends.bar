import React from "reactn";
import {Overtitle, Subtitle, Title} from "./ContentWidgetText.styled";
import {WidgetVertical} from "../../../../futuremodules/reactComponentStyles/reactCommon.styled";

import {resolveFunction} from "../../../../modules/trends/layout";

export const ContentWidgetText = ({datasets, config}) => {

  return (
    <WidgetVertical>
      <Overtitle>{config.subGroupKey}</Overtitle>
      <Title>{resolveFunction(config.valueFunctionName, config.groupKey, config.subGroupKey, config.valueNameKey, datasets)}</Title>
      <Subtitle>{config.valueNameKey}</Subtitle>
    </WidgetVertical>
  )
};
