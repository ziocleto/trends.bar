import "./react-grid-styles.css"
import "./react-resizable-styles.css"

import React, {Fragment, useState} from "react";
import {ContentWidgetText} from './ContentWidgetText'
import {ContentWidgetTable} from "./ContentWidgetTable";
import {ContentWidgetGraphXY} from "./ContentWidgetGraphXY";
import {ModalDatasetPixel} from "./Layout/ModalDatasetPicker";
import {Container} from "./ContentWidgetText.styled";
import {FlexVertical} from "../../../futuremodules/reactComponentStyles/reactCommon.styled";

export const ContentWidget = ({data, config, onSave}) => {

  const [showDatasetPicker, setShowDatasetPicker] = useState({});

  let contentBody;
  switch (config.type) {
    case "text":
      contentBody = (
        <FlexVertical justifyContent={"center"}
          onClick={ () => setShowDatasetPicker({ [config.i]: true})}>
          <ContentWidgetText config={config} onSave={onSave}/>
        </FlexVertical>
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
      {showDatasetPicker[config.i] && <ModalDatasetPixel onClose={() => setShowDatasetPicker({})}
                                                         widget={config}
                                                         defaultValue={config.title}
                                                         updater={(newValue) => onSave({
                                                           ...config,
                                                           title: newValue
                                                         })}/>}
    </Container>
  )
};
