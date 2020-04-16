import "./Layout/react-grid-styles.css"
import "./Layout/react-resizable-styles.css"

import React, {Fragment, useState} from "react";
import {ContentWidgetText} from './ContentWidgets/ContentWidgetText'
import {ContentWidgetTable} from "./ContentWidgetTable";
import {ContentWidgetGraphXY} from "./ContentWidgetGraphXY";
import {ModalDatasetPixel} from "./Layout/ModalDatasetPicker";
import {Container} from "./ContentWidgets/ContentWidgetText.styled";
import {FlexHighlighter} from "../../../futuremodules/reactComponentStyles/reactCommon.styled";
import {globalLayoutState} from "../../../modules/trends/layout";
import {useGlobalState} from "../../../futuremodules/globalhelper/globalHelper";
import {ContentWidgetTextSingle} from "./ContentWidgets/ContentWidgetTextSingle";
import {ContentWidgetTextWithSubtitle} from "./ContentWidgets/ContentWidgetTextWithSubtitle";

export const ContentWidget = ({data, cellIndex, onSave}) => {

  const [showDatasetPicker, setShowDatasetPicker] = useState({});
  const layout = useGlobalState(globalLayoutState);

  if ( !layout ) {
    return <Fragment/>
  }

  const config = layout && layout.gridContent[layout.gridLayout.findIndex(v => v.i === cellIndex)];

  let contentBody;
  switch (config.type) {
    case "text":
      contentBody = (
        <FlexHighlighter
          justifyContent={"center"}
          padding={"15px"}
          onClick={ () => setShowDatasetPicker({ [config.i]: true})}>
          <ContentWidgetText config={config} onSave={onSave}/>
        </FlexHighlighter>
      );
      break;
    case "text-single":
      contentBody = (
        <FlexHighlighter
          justifyContent={"center"}
          padding={"15px"}
          onClick={ () => setShowDatasetPicker({ [config.i]: true})}>
          <ContentWidgetTextSingle config={config} onSave={onSave}/>
        </FlexHighlighter>
      );
      break;
    case "text-subtitle":
      contentBody = (
        <FlexHighlighter
          justifyContent={"center"}
          padding={"15px"}
          onClick={ () => setShowDatasetPicker({ [config.i]: true})}>
          <ContentWidgetTextWithSubtitle config={config} onSave={onSave}/>
        </FlexHighlighter>
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
    <Container>
      {contentBody}
      {showDatasetPicker[config.i] && <ModalDatasetPixel
        cellIndex={config.i}
        onClose={() => setShowDatasetPicker({})}/>}
    </Container>
  )
};
