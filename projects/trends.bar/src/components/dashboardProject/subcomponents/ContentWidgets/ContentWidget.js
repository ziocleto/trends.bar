import React, {Fragment} from "react";
import {ContentWidgetText} from "./ContentWidgetText";
import {ContentWidgetTextSingle} from "./ContentWidgetTextSingle";
import {ContentWidgetTextWithSubtitle} from "./ContentWidgetTextWithSubtitle";
import {ContentWidgetTable} from "./ContentWidgetTable";
import {ContentWidgetGraphXY} from "./ContentWidgetGraphXY";

export const ContentWidget = ({datasets, config}) => {

  if (!datasets) {
    return <Fragment/>
  }

  let contentBody;
  switch (config.type) {
    case "text":
      contentBody = (
          <ContentWidgetText datasets={datasets} config={config}/>
      );
      break;
    case "text-single":
      contentBody = (
          <ContentWidgetTextSingle datasets={datasets} config={config}/>
      );
      break;
    case "text-subtitle":
      contentBody = (
          <ContentWidgetTextWithSubtitle datasets={datasets} config={config}/>
      );
      break;
    case "table":
      contentBody = (
          <ContentWidgetTable datasets={datasets} config={config}/>
      );
      break;
    case "graphxy":
      contentBody = (
          <ContentWidgetGraphXY datasets={datasets} config={config}/>
      );
      break;
    default:
      contentBody = (
        <Fragment/>
      );
  }

  return (
    <Fragment>
      {contentBody}
    </Fragment>
  )
};
