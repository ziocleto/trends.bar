import React, {Fragment} from "react";
import {ContentWidget} from "../ContentWidgets/ContentWidget";
import {useGlobalState} from "../../../../futuremodules/globalhelper/globalHelper";
import {globalLayoutState} from "../../../../modules/trends/layout";
import {EditingLayoutDataSource} from "../../../../modules/trends/globals";
import {ModalDatasetPixel} from "./ModalDatasetPicker";

export const LayoutContentWidget = ({cellIndex, showDatasetPicker, setShowDatasetPicker}) => {

  const layout = useGlobalState(globalLayoutState);
  const datasets = useGlobalState(EditingLayoutDataSource);

  if (!layout || !datasets) {
    return <Fragment/>
  }

  const config = layout && layout.gridContent[layout.gridLayout.findIndex(v => v.i === cellIndex)];

  return (
    <Fragment>
      <ContentWidget datasets={datasets} config={config}/>
      {showDatasetPicker[config.i] && <ModalDatasetPixel
        cellIndex={config.i}
        onClose={() => setShowDatasetPicker({})}/>}
    </Fragment>
  )
};
