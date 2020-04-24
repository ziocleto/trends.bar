import "./react-grid-styles.css"
import "./react-resizable-styles.css"

import React, {Fragment, useState} from "reactn";
import GridLayout from 'react-grid-layout';
import {DivLayout, SpanEditLayoutCell, SpanRemoveLayoutCell} from "./LayoutEditor.styled";
import {ButtonDiv, DangerColorSpan} from "../../../../futuremodules/reactComponentStyles/reactCommon.styled";
import {LayoutContentWidget} from "./LayoutContentWidget";
import {onGridLayoutChange, onRemoveCell} from "./LayoutEditorLogic";

export const LayoutEditor = ({layout, setLayout}) => {

  const [showDatasetPicker, setShowDatasetPicker] = useState({});
  const datasets = layout.datasets;

  return (
    <Fragment>
      <GridLayout layout={layout.gridLayout}
                  cols={12}
                  rowHeight={50}
                  width={1024}
                  onLayoutChange={(l)=>onGridLayoutChange(l, setLayout)}>
        {layout.gridLayout.map(elem => {
          return (
            <DivLayout key={elem.i}>
              <LayoutContentWidget datasets={datasets}
                                   layout={layout}
                                   setLayout={setLayout}
                                   config={layout.gridContent[layout.gridLayout.findIndex(v => v.i === elem.i)]}
                                   showDatasetPicker={showDatasetPicker}
                                   setShowDatasetPicker={setShowDatasetPicker}
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
                  onClick={() => setShowDatasetPicker({[elem.i]: true})}>
                  <i className={"fa fa-edit"}/>
                </ButtonDiv>
              </SpanEditLayoutCell>
            </DivLayout>
          );
        })}
      </GridLayout>
    </Fragment>
  )
};
