import "./Layout/react-grid-styles.css"
import "./Layout/react-resizable-styles.css"

import React, {Fragment, useState} from "react";
import {ContentWidgetText} from './ContentWidgets/ContentWidgetText'
import {ContentWidgetTable} from "./ContentWidgets/ContentWidgetTable";
import {ContentWidgetGraphXY} from "./ContentWidgetGraphXY";
import {ModalDatasetPixel} from "./Layout/ModalDatasetPicker";
import {Container} from "./ContentWidgets/ContentWidgetText.styled";
import {Div, FlexHighlighter} from "../../../futuremodules/reactComponentStyles/reactCommon.styled";
import {globalLayoutState} from "../../../modules/trends/layout";
import {useGlobalState} from "../../../futuremodules/globalhelper/globalHelper";
import {ContentWidgetTextSingle} from "./ContentWidgets/ContentWidgetTextSingle";
import {ContentWidgetTextWithSubtitle} from "./ContentWidgets/ContentWidgetTextWithSubtitle";

export const ContentWidget = ({cellIndex}) => {

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
          <ContentWidgetText config={config}/>
        </FlexHighlighter>
      );
      break;
    case "text-single":
      contentBody = (
        <FlexHighlighter
          justifyContent={"center"}
          padding={"15px"}
          onClick={ () => setShowDatasetPicker({ [config.i]: true})}>
          <ContentWidgetTextSingle config={config}/>
        </FlexHighlighter>
      );
      break;
    case "text-subtitle":
      contentBody = (
        <FlexHighlighter
          justifyContent={"center"}
          padding={"15px"}
          onClick={ () => setShowDatasetPicker({ [config.i]: true})}>
          <ContentWidgetTextWithSubtitle config={config}/>
        </FlexHighlighter>
      );
      break;
    case "table":
      contentBody = (
        <Div
          width={"100%"}
          height={"100%"}
          justifyContent={"center"}
          padding={"0"}
          onClick={ () => setShowDatasetPicker({ [config.i]: true})}>
          <ContentWidgetTable config={config}/>
        </Div>
      );
      break;
    case "graphxy":
      contentBody = (
        <ContentWidgetGraphXY config={config}/>
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
