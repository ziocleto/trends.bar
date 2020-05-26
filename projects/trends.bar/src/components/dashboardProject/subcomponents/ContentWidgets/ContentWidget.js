import React from "react";
import {ContentWidgetText} from "./ContentWidgetText";
import {ContentWidgetTextSingle} from "./ContentWidgetTextSingle";
import {ContentWidgetTextWithSubtitle} from "./ContentWidgetTextWithSubtitle";
import {ContentWidgetTable} from "./ContentWidgetTable";
import {ContentWidgetGraphXY} from "./ContentWidgetGraphXY";

export const ContentWidget = ({datasets, config}) => {

  return (
    <>
      {config.type === "text" && <ContentWidgetText datasets={datasets} config={config}/>}
      {config.type === "text-single" && <ContentWidgetTextSingle datasets={datasets} config={config}/>}
      {config.type === "text-subtitle" && <ContentWidgetTextWithSubtitle datasets={datasets} config={config}/>}
      {config.type === "table" && <ContentWidgetTable datasets={datasets} config={config}/>}
      {config.type === "graphxy" && <ContentWidgetGraphXY datasets={datasets} config={config}/>}
    </>
  )
};
