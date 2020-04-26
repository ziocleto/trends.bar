import "./react-grid-styles.css"
import "./react-resizable-styles.css"

import React, {Fragment, useState} from "reactn";
import GridLayout from 'react-grid-layout';
import {DivLayout, SpanEditLayoutCell, SpanRemoveLayoutCell} from "./LayoutEditor.styled";
import {ButtonDiv, DangerColorSpan} from "../../../../futuremodules/reactComponentStyles/reactCommon.styled";
import {onGridLayoutChange, onRemoveCell} from "./LayoutEditorLogic";
import {LayoutCellEditor} from "./LayoutCellEditor";
import {ContentWidget} from "../ContentWidgets/ContentWidget";

export const LayoutEditor = ({layout, setLayout}) => {

  const [showDatasetPicker, setShowDatasetPicker] = useState(null);

  return (
    <Fragment>
      {!showDatasetPicker &&
      <GridLayout layout={layout.gridLayout}
                  cols={12}
                  rowHeight={50}
                  width={1024}
                  onLayoutChange={(l)=>onGridLayoutChange(l, setLayout)}>
        {layout.gridLayout.map(elem => {
          return (
            <DivLayout key={elem.i}>
              <ContentWidget datasets={layout.dataSources}
                             config={layout.gridContent[layout.gridLayout.findIndex(v => v.i === elem.i)]}
              />
              <SpanRemoveLayoutCell title="Remove element">
                <ButtonDiv onClick={() => onRemoveCell(elem.i, layout, setLayout)}>
                  <DangerColorSpan><i className={"fas fa-times"}/></DangerColorSpan>
                </ButtonDiv>
              </SpanRemoveLayoutCell>
              <SpanEditLayoutCell title="Edit element">
                <ButtonDiv
                  color={'var(--logo-color-1)'}
                  hoveredColor={"white"}
                  onClick={() => setShowDatasetPicker(elem.i)}>
                  <i className={"fa fa-edit"}/>
                </ButtonDiv>
              </SpanEditLayoutCell>
            </DivLayout>
          );
        })}
      </GridLayout>}
      {showDatasetPicker && <LayoutCellEditor
        datasets={layout.dataSources}
        config={layout.gridContent[layout.gridLayout.findIndex(v => v.i === showDatasetPicker)]}
        layout={layout}
        setLayout={setLayout}
        onClose={() => setShowDatasetPicker(null)}/>}
    </Fragment>
  )
};
