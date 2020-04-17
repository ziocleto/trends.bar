import React, {Fragment} from "react";
import {ContentWidget} from "../ContentWidgets/ContentWidget";
import {ModalDatasetPixel} from "./ModalDatasetPicker";

export const LayoutContentWidget = ({datasets, config, layout, setLayout, showDatasetPicker, setShowDatasetPicker}) => {

  return (
    <Fragment>
      <ContentWidget datasets={datasets} config={config}/>
      {showDatasetPicker[config.i] && <ModalDatasetPixel
        datasets={datasets}
        config={config}
        layout={layout}
        setLayout={setLayout}
        onClose={() => setShowDatasetPicker({})}/>}
    </Fragment>
  )
};
