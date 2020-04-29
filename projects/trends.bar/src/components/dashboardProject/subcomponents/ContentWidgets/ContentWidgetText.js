import React from "reactn";
import {Overtitle, Subtitle, Title} from "./ContentWidgetText.styled";
import {WidgetVertical} from "../../../../futuremodules/reactComponentStyles/reactCommon.styled";

import {resolveFunction} from "../../../../modules/trends/layout";

export const ContentWidgetText = ({datasets, config}) => {

  return (
    <WidgetVertical>
      <Overtitle>{resolveFunction("getDatasetZGroupValue", config.groupKey, config.subGroupKey, config.zGroupIndex, config.zGroupRow, datasets)}</Overtitle>
      <Title>{resolveFunction("getValue", config.groupKey, config.subGroupKey, config.zGroupIndex, config.zGroupRow, datasets)}</Title>
      <Subtitle>{resolveFunction("getDatasetYGroupName", config.groupKey, config.subGroupKey, config.zGroupIndex, config.zGroupRow, datasets)}</Subtitle>
    </WidgetVertical>
  )
};
