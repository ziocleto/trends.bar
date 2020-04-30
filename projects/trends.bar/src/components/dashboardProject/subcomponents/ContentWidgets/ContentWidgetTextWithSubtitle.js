import React from "reactn";
import {Subtitle, Title} from "./ContentWidgetText.styled";
import {WidgetVertical} from "../../../../futuremodules/reactComponentStyles/reactCommon.styled";
import {resolveFunction} from "../../../../modules/trends/layout";

export const ContentWidgetTextWithSubtitle = ({datasets, config}) => {
  return (
    <WidgetVertical>
      <Title>{resolveFunction("getValue", config.groupKey, config.subGroupKey, config.zGroupIndex, config.zGroupRow, datasets)}</Title>
      <Subtitle>{resolveFunction("getDatasetYGroupName", config.groupKey, config.subGroupKey, config.zGroupIndex, config.zGroupRow, datasets)}</Subtitle>
    </WidgetVertical>
  )
};
