import "./Layout/react-grid-styles.css"
import "./Layout/react-resizable-styles.css"

import React, {Fragment, useState} from "react";
import {ContentWidgetText} from './ContentWidgets/ContentWidgetText'
import {ContentWidgetTable} from "./ContentWidgets/ContentWidgetTable";
import {ContentWidgetGraphXY} from "./ContentWidgets/ContentWidgetGraphXY";
import {ModalDatasetPixel} from "./Layout/ModalDatasetPicker";
import {Container} from "./ContentWidgets/ContentWidgetText.styled";
import {Div, FlexHighlighter} from "../../../futuremodules/reactComponentStyles/reactCommon.styled";
import {globalLayoutState} from "../../../modules/trends/layout";
import {useGlobalState} from "../../../futuremodules/globalhelper/globalHelper";
import {ContentWidgetTextSingle} from "./ContentWidgets/ContentWidgetTextSingle";
import {ContentWidgetTextWithSubtitle} from "./ContentWidgets/ContentWidgetTextWithSubtitle";
import {EditingLayoutDataSource} from "../../../modules/trends/globals";

export const ContentWidget = ({cellIndex}) => {

  const [showDatasetPicker, setShowDatasetPicker] = useState({});
  const layout = useGlobalState(globalLayoutState);
  const datasets = useGlobalState(EditingLayoutDataSource);

  if (!layout || !datasets) {
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
          onClick={() => setShowDatasetPicker({[config.i]: true})}>
          <ContentWidgetText config={config}/>
        </FlexHighlighter>
      );
      break;
    case "text-single":
      contentBody = (
        <FlexHighlighter
          justifyContent={"center"}
          padding={"15px"}
          onClick={() => setShowDatasetPicker({[config.i]: true})}>
          <ContentWidgetTextSingle config={config}/>
        </FlexHighlighter>
      );
      break;
    case "text-subtitle":
      contentBody = (
        <FlexHighlighter
          justifyContent={"center"}
          padding={"15px"}
          onClick={() => setShowDatasetPicker({[config.i]: true})}>
          <ContentWidgetTextWithSubtitle config={config}/>
        </FlexHighlighter>
      );
      break;
    case "table":
      contentBody = (
        <Div
          onClick={() => setShowDatasetPicker({[config.i]: true})}>
          <ContentWidgetTable config={config}/>
        </Div>
      );
      break;
    case "graphxy":
      console.log("Rendering graph, apparently");
      contentBody = (
        <Div
          width={"100%"}
          onClick={() => setShowDatasetPicker({[config.i]: true})}>
          <ContentWidgetGraphXY datasets={datasets} config={config}/>
        </Div>
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
