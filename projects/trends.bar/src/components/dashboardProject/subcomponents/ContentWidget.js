import "./react-grid-styles.css"
import "./react-resizable-styles.css"

import React, {Fragment} from "react";
import {ContentWidgetText} from './ContentWidgetText'
import {ContentWidgetTable} from "./ContentWidgetTable";
import {ContentWidgetGraphXY} from "./ContentWidgetGraphXY";

export const ContentWidget = ({data, config, onSave}) => {

  // const [showDatasetPicker, setShowDatasetPicker] = useState(false);

  let contentBody;
  switch (config.type) {
    case "text":
      contentBody = (
        <ContentWidgetText config={config} onSave={onSave}/>
      );
      break;
    case "table":
      contentBody = (
        <ContentWidgetTable data={data} config={config}/>
      );
      break;
    case "graphxy":
      contentBody = (
        <ContentWidgetGraphXY data={data} config={config}/>
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
